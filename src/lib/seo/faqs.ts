export interface FAQ {
  question: string
  answer: string
}

export const HOME_FAQS: FAQ[] = [
  {
    question: 'What is CloudForShare?',
    answer:
      'CloudForShare is a free, fast, and secure file-sharing platform. Upload files and share them instantly with a link — no signup required. You can set expiration times, password protection, and download limits.',
  },
  {
    question: 'Is CloudForShare free to use?',
    answer:
      'Yes, CloudForShare is completely free. You can upload files up to 100 MB and share up to 10 files per upload without paying anything or creating an account.',
  },
  {
    question: 'Do I need to create an account to share files?',
    answer:
      'No, you do not need an account to share files on CloudForShare. Simply drag and drop your files, and you will get a shareable link instantly. An account is optional if you want to manage all your uploads in one place.',
  },
  {
    question: 'How long do files stay on CloudForShare?',
    answer:
      'You choose how long your files stay. Options include 1 hour, 24 hours, 7 days, 30 days, or forever. Once the expiry time is reached, the file is automatically deleted from our servers.',
  },
  {
    question: 'Can I password-protect my shared files?',
    answer:
      'Yes, you can add password protection to any file you share. Only people who have the password can download the file.',
  },
  {
    question: 'What is the maximum file size I can upload?',
    answer:
      'You can upload files up to 100 MB each, and up to 10 files per upload session. This covers most documents, images, videos, and archives.',
  },
  {
    question: 'Is CloudForShare secure?',
    answer:
      'Yes. CloudForShare uses encrypted connections (HTTPS), secure cloud storage (Supabase), and optional password protection. Your files are never shared with third parties.',
  },
  {
    question: 'Can I share files via QR code?',
    answer:
      'Yes, every shared file gets a unique QR code. Anyone can scan it with their phone camera to instantly access and download the file.',
  },
]