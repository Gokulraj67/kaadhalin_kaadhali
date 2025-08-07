import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "@/components/ui/use-toast";

import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

const RequestQuote = () => {
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [description, setDescription] = useState("");
  const { lang, setLang } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quote || !description) {
      toast({
        title: lang === 'en' ? "Error" : "பிழை",
        description: lang === 'en'
          ? "Please fill out all fields."
          : "தயவுசெய்து அனைத்து விவரங்களையும் நிரப்பவும்.",
        variant: "destructive",
      });
      return;
    }
    // Send the data to Supabase
    const { error } = await supabase.from("request_quotes").insert({ name, quote, description });
    if (error) {
      toast({
        title: lang === 'en' ? "Error" : "பிழை",
        description: lang === 'en'
          ? "Failed to submit your quote."
          : "உங்கள் மேற்கோளை சமர்ப்பிக்க முடியவில்லை.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: lang === 'en' ? "Success" : "வெற்றி",
      description: lang === 'en'
        ? "Your quote has been submitted."
        : "உங்கள் மேற்கோள் சமர்ப்பிக்கப்பட்டது.",
    });
    setName("");
    setQuote("");
    setDescription("");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{lang === 'en' ? 'Request a Quote' : 'மேற்கோள் கோரிக்கை'}</h1>
      </div>
      <div className="mb-6 p-4 rounded bg-gray-50 border text-sm">
        {lang === 'en' ? (
          <ul className="list-disc ml-6 mt-2">
            <li>Please add your quote below, and make sure to include the following details:</li>
            <li>Your Name</li>
            <li>Category (e.g., Motivation, Love, Life, etc.)</li>
            <li>Language (e.g., English, Tamil)</li>
            <li>Date (optional)</li>
          </ul>
        ) : (
          <ul className="list-disc ml-6 mt-2">
            <li>தயவுசெய்து உங்கள் மேற்கோளைக் கீழே சேர்க்கவும், மற்றும் கீழ்காணும் விவரங்களை வழங்கவும்:</li>
            <li>உங்கள் பெயர்</li>
            <li>வகை (உதா: ஊக்கம், காதல், வாழ்க்கை, போன்றவை)</li>
            <li>மொழி (உதா: தமிழ், ஆங்கிலம்)</li>
            <li>தேதி (விருப்பத்திற்கு ஏற்ப)</li>
          </ul>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            {lang === 'en' ? 'Name' : 'உங்கள் பெயர்'}
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={lang === 'en' ? 'Your Name' : 'உங்கள் பெயர்'}
          />
        </div>
        <div>
          <label htmlFor="quote" className="block text-sm font-medium text-gray-700">
            {lang === 'en' ? 'Quote' : 'மேற்கோள் / கவிதை'}
          </label>
          <Textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder={lang === 'en' ? 'Your Quote' : 'உங்கள் மேற்கோள் / கவிதை'}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            {lang === 'en' ? 'Description' : 'விளக்கம்'}
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={lang === 'en' ? 'Description (optional details)' : 'விளக்கம் (விருப்பம்)'}
          />
        </div>
        <Button type="submit">{lang === 'en' ? 'Submit' : 'சமர்ப்பிக்கவும்'}</Button>
      </form>
    </div>
  );
};

export default RequestQuote;
