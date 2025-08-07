import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Quote {
  id: string;
  quote: string;
  author: string;
  description?: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
    description?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          categories (
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching quotes",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addQuote = async (quoteData: Omit<Quote, 'id' | 'created_at' | 'updated_at' | 'categories'>) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .insert(quoteData);

      if (error) throw error;
      
      toast({
        title: "Quote added successfully",
        description: "The quote has been added to the collection"
      });
      
      fetchQuotes();
    } catch (error: any) {
      toast({
        title: "Error adding quote",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateQuote = async (id: string, quoteData: Partial<Omit<Quote, 'id' | 'created_at' | 'updated_at' | 'categories'>>) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update(quoteData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Quote updated successfully",
        description: "The quote has been updated"
      });
      
      fetchQuotes();
    } catch (error: any) {
      toast({
        title: "Error updating quote",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Quote deleted successfully",
        description: "The quote has been removed from the collection"
      });
      
      fetchQuotes();
    } catch (error: any) {
      toast({
        title: "Error deleting quote",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .insert(categoryData);

      if (error) throw error;
      
      toast({
        title: "Category added successfully",
        description: "The category has been created"
      });
      
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id' | 'created_at'>>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Category updated successfully",
        description: "The category has been updated"
      });
      
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('id')
        .eq('category_id', id)
        .limit(1);

      if (quotesError) throw quotesError;

      if (quotes && quotes.length > 0) {
        toast({
          title: "Cannot delete category",
          description: "This category is still being used by one or more quotes.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Category deleted successfully",
        description: "The category has been removed"
      });
      
      fetchCategories();
      fetchQuotes();
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchQuotes(), fetchCategories()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    quotes,
    categories,
    loading,
    fetchQuotes,
    fetchCategories,
    addQuote,
    updateQuote,
    deleteQuote,
    addCategory,
    updateCategory,
    deleteCategory
  };
};