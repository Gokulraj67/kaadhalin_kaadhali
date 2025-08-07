import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

const Feedback = () => {
  const [email, setEmail] = useState("");
  const [thoughts, setThoughts] = useState("");
  const { lang } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !thoughts) {
      toast({
        title: lang === 'en' ? "Error" : "பிழை",
        description: lang === 'en'
          ? "Please fill out all fields."
          : "தயவுசெய்து அனைத்து விவரங்களையும் நிரப்பவும்.",
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase.from("feedbacks").insert([{ email, thoughts }]);
    if (error) {
      toast({
        title: lang === 'en' ? "Error" : "பிழை",
        description: lang === 'en'
          ? "Failed to submit feedback."
          : "உங்கள் கருத்தை சமர்ப்பிக்க முடியவில்லை.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: lang === 'en' ? "Success" : "வெற்றி",
      description: lang === 'en'
        ? "Your feedback has been submitted."
        : "உங்கள் கருத்து சமர்ப்பிக்கப்பட்டது.",
    });
    setEmail("");
    setThoughts("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{lang === 'en' ? 'Feedback' : 'கருத்து'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {lang === 'en' ? 'Email' : 'மின்னஞ்சல்'}
          </label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={lang === 'en' ? 'Your Email' : 'உங்கள் மின்னஞ்சல்'}
          />
        </div>
        <div>
          <label htmlFor="thoughts" className="block text-sm font-medium text-gray-700">
            {lang === 'en' ? 'Your Thoughts' : 'உங்கள் கருத்துகள்'}
          </label>
          <Textarea
            id="thoughts"
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder={lang === 'en' ? 'Share your thoughts...' : 'உங்கள் கருத்துகளை பகிரவும்...'}
          />
        </div>
        <Button type="submit">{lang === 'en' ? 'Submit' : 'சமர்ப்பிக்கவும்'}</Button>
      </form>
    </div>
  );
};

export default Feedback;
