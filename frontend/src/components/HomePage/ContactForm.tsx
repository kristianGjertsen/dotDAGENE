import { useState, type FormEvent } from 'react';
import { Button } from '../Button';

type FormData = {
  bedriftsnavn: string;
  kontaktperson: string;
  stilling: string;
  epost: string;
  telefon: string;
  melding: string;
};

type SubmitStatus = 'idle' | 'success' | 'error';

export const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    bedriftsnavn: '',
    kontaktperson: '',
    stilling: '',
    epost: '',
    telefon: '',
    melding: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  /*
  
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const emailBody = `
Bedriftsnavn: ${formData.bedriftsnavn}
Kontaktperson: ${formData.kontaktperson}
Stilling: ${formData.stilling}
E-post: ${formData.epost}
Telefon: ${formData.telefon}

Melding:
${formData.melding}
      `.trim();

      const mailtoLink = `mailto:kontakt@dotdagene.no?subject=Henvendelse fra ${formData.bedriftsnavn
        }&body=${encodeURIComponent(emailBody)}`;

      window.location.href = mailtoLink;

      setFormData({
        bedriftsnavn: '',
        kontaktperson: '',
        stilling: '',
        epost: '',
        telefon: '',
        melding: '',
      });
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... hele skjemaet uendret ... */}

          <div className="flex flex-col items-stretch justify-center">
            <Button color="green" type="submit" disabled={isSubmitting}>
              Send Melding
            </Button>
          </div>

          {submitStatus === 'success' && (
            <div className="bg-dotgreen border-3 border-black p-6 text-white">
              <p className="text-center text-lg font-medium">
                E-postklienten din skal nå åpne seg. Takk for din henvendelse!
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="border-3 border-black bg-red-600 p-4 text-white">
              Noe gikk galt ved åpning av e-postklienten. Vennligst prøv igjen.
            </div>
          )}
        </form>
      </div>
    </>
  );
};
