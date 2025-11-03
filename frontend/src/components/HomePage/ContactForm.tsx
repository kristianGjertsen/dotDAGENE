import { useState } from 'react';
import { Button } from '../Button';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    bedriftsnavn: '',
    kontaktperson: '',
    stilling: '',
    epost: '',
    melding: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Send failed');

      setFormData({
        bedriftsnavn: '',
        kontaktperson: '',
        stilling: '',
        epost: '',
        melding: '',
      });
      setSubmitStatus('success');
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <div id="contact" className="mx-auto max-w-4xl scroll-mt-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bedriftsnavn: full line */}
          <div className="space-y-3">
            <label
              htmlFor="bedriftsnavn"
              className="text-lg font-bold text-gray-800"
            >
              Bedriftsnavn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="bedriftsnavn"
              name="bedriftsnavn"
              value={formData.bedriftsnavn}
              onChange={handleInputChange}
              required
              placeholder="Navn på bedriften"
              className="w-full border-3 border-black bg-white px-3 py-3 text-lg"
            />
          </div>

          {/* Kontaktperson + Stilling: split line */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <label
                htmlFor="kontaktperson"
                className="text-lg font-bold text-gray-800"
              >
                Kontaktperson <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kontaktperson"
                name="kontaktperson"
                value={formData.kontaktperson}
                onChange={handleInputChange}
                required
                placeholder="Ditt navn"
                className="w-full border-3 border-black bg-white px-3 py-3 text-lg"
              />
            </div>
            <div className="space-y-3">
              <label
                htmlFor="stilling"
                className="text-lg font-bold text-gray-800"
              >
                Stilling <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="stilling"
                name="stilling"
                value={formData.stilling}
                onChange={handleInputChange}
                required
                placeholder="Din stilling"
                className="w-full border-3 border-black bg-white px-3 py-3 text-lg"
              />
            </div>
          </div>

          {/* E-post: full line */}
          <div className="space-y-3">
            <label htmlFor="epost" className="text-lg font-bold text-gray-800">
              E-post <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="epost"
              name="epost"
              value={formData.epost}
              onChange={handleInputChange}
              required
              placeholder="din@bedrift.no"
              className="w-full border-3 border-black bg-white px-3 py-3 text-lg"
            />
          </div>

          {/* Melding: textarea, about 4 lines */}
          <div className="space-y-3">
            <label
              htmlFor="melding"
              className="text-lg font-bold text-gray-800"
            >
              Melding
            </label>
            <textarea
              id="melding"
              name="melding"
              value={formData.melding}
              onChange={handleInputChange}
              rows={4}
              placeholder="Fortell oss om deres interesse for dotDAGENE, hvilke studenter dere ønsker å møte, eller andre spørsmål..."
              className="resize-vertical w-full border-3 border-black bg-white px-3 py-3 text-lg"
            />
          </div>

          <div className="flex flex-col items-stretch justify-center">
            <Button color="green" type="submit" disabled={isSubmitting}>
              Send Melding
            </Button>
          </div>

          {submitStatus === 'success' && (
            <div className="bg-dotpurple border-3 border-black p-6 text-white">
              <p className="text-center text-lg font-medium">
                Takk! Henvendelsen er sendt.
              </p>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-red-600 border-3 border-black p-6 text-white">
              <p className="text-center text-lg font-medium">
                Oisann! Klarte ikke å sende. Kontakt oss direkte på kontakt@dotdagene.no
              </p>
            </div>
          )}
        </form>
      </div>
    </>
  );
};
