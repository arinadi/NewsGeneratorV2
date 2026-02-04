'use client';

/**
 * RateLimiter - Queue requests to avoid hitting API rate limits
 * Free tier Gemini: ~15 RPM (requests per minute)
 */

interface QueuedRequest<T> {
    fn: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (error: Error) => void;
    retries: number;
}

class RateLimiter {
    private queue: QueuedRequest<unknown>[] = [];
    private isProcessing = false;
    private lastRequestTime = 0;
    private readonly minInterval: number; // ms between requests
    private readonly maxRetries: number;

    constructor(requestsPerMinute: number = 10, maxRetries: number = 3) {
        // Add buffer: if 10 RPM allowed, use 6 RPM to be safe
        this.minInterval = Math.ceil(60000 / requestsPerMinute);
        this.maxRetries = maxRetries;
    }

    /**
     * Add request to queue and return promise
     */
    async enqueue<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push({
                fn,
                resolve: resolve as (value: unknown) => void,
                reject,
                retries: 0,
            });
            this.processQueue();
        });
    }

    private async processQueue(): Promise<void> {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;

        while (this.queue.length > 0) {
            const request = this.queue.shift()!;

            // Wait for minimum interval since last request
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequestTime;
            if (timeSinceLastRequest < this.minInterval) {
                await this.sleep(this.minInterval - timeSinceLastRequest);
            }

            try {
                this.lastRequestTime = Date.now();
                const result = await request.fn();
                request.resolve(result);
            } catch (error: unknown) {
                const err = error as Error & { status?: number };

                // Check if rate limited (429) or server error (5xx)
                if ((err.status === 429 || (err.status && err.status >= 500)) && request.retries < this.maxRetries) {
                    // Exponential backoff: 2s, 4s, 8s
                    const backoffTime = Math.pow(2, request.retries + 1) * 1000;
                    console.log(`[RateLimiter] Rate limited, retrying in ${backoffTime}ms (attempt ${request.retries + 1}/${this.maxRetries})`);

                    await this.sleep(backoffTime);
                    request.retries++;
                    this.queue.unshift(request); // Re-add to front of queue
                } else {
                    request.reject(error as Error);
                }
            }
        }

        this.isProcessing = false;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get queue status for UI feedback
     */
    getStatus(): { queueLength: number; isProcessing: boolean } {
        return {
            queueLength: this.queue.length,
            isProcessing: this.isProcessing,
        };
    }
}

// Singleton instance - 10 RPM with buffer (Gemini free tier is ~15 RPM)
export const rateLimiter = new RateLimiter(10, 3);

/**
 * Wrap an async function with rate limiting
 */
export function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
    return rateLimiter.enqueue(fn);
}
