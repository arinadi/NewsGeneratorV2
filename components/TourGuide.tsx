'use client';

import { useEffect, useRef } from 'react';
import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

interface TourGuideProps {
    startManually?: boolean;
    onClose?: () => void;
}

export default function TourGuide({ startManually, onClose }: TourGuideProps) {
    const driverObj = useRef<ReturnType<typeof driver> | null>(null);

    useEffect(() => {
        driverObj.current = driver({
            showProgress: true,
            animate: true,
            doneBtnText: 'Selesai',
            nextBtnText: 'Lanjut',
            prevBtnText: 'Kembali',
            onPopoverRender: (popover) => {
                // Custom styling if needed via class injection or direct DOM manipulation
            },
            onDestroyed: () => {
                if (onClose) onClose();
            },
            steps: [
                {
                    element: '#header-logo',
                    popover: {
                        title: 'Selamat Datang di Kuli Tinta AI!',
                        description: 'Asisten cerdas Anda untuk membuat berita berkualitas tinggi dalam sekejap.',
                        side: 'bottom',
                        align: 'start',
                    },
                },
                {
                    element: '#tour-history-sidebar',
                    popover: {
                        title: 'Riwayat & Draft',
                        description: 'Akses draft yang tersimpan dan riwayat pembuatan berita Anda di sini.',
                        side: 'right',
                        align: 'start',
                    },
                },
                {
                    element: '#header-settings',
                    popover: {
                        title: 'API Settings',
                        description: 'Atur API Key Gemini Anda di sini agar aplikasi dapat bekerja.',
                        side: 'bottom',
                        align: 'center',
                    },
                },
                {
                    element: '#tour-input-area',
                    popover: {
                        title: 'Masukan Konten',
                        description: 'Masukkan transkrip wawancara, konteks tambahan, atau upload file dokumen di sini.',
                        side: 'right',
                        align: 'start',
                    },
                },

                {
                    element: '#tour-article-settings',
                    popover: {
                        title: 'Parameter Berita',
                        description: 'Sesuaikan Angle (sudut pandang), Gaya Bahasa, dan Goal artikel yang ingin dibuat.',
                        side: 'top',
                        align: 'center',
                    },
                },
                {
                    element: '#tour-generate-btn',
                    popover: {
                        title: 'Generate Berita',
                        description: 'Klik tombol ini untuk memproses masukan dan membuat artikel berita.',
                        side: 'top',
                        align: 'center',
                    },
                },
                {
                    element: '#tour-preview-panel',
                    popover: {
                        title: 'Hasil & Preview',
                        description: 'Lihat hasil artikel, edit judul, dan salin hasilnya di sini.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: '#header-help-btn',
                    popover: {
                        title: 'Bantuan',
                        description: 'Butuh panduan lagi? Klik tombol ini kapan saja untuk memulai ulang tour ini.',
                        side: 'bottom',
                        align: 'end',
                    },
                },
            ],
        });
    }, [onClose]);

    useEffect(() => {
        // Check if user has seen the tour
        const hasSeenTour = localStorage.getItem('kuli_tinta_has_seen_tour');

        if (startManually || !hasSeenTour) {
            // Small timeout to ensure DOM is ready
            const timer = setTimeout(() => {
                driverObj.current?.drive();
                if (!hasSeenTour) {
                    localStorage.setItem('kuli_tinta_has_seen_tour', 'true');
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [startManually]);

    return null; // This component doesn't render anything visual itself
}
