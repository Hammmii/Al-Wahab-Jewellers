import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us - Al-Wahab Jewellers",
  description: "Get in touch with Al-Wahab Jewellers for inquiries, appointments, or support.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}