import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuotes, Quote, Category } from "@/hooks/useQuotes";
import { QuoteCard } from "@/components/QuoteCard";
import { QuoteForm } from "@/components/QuoteForm";
import { CategoryForm } from "@/components/CategoryForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Filter, Tag, Edit, Trash } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface QuoteRequest {
  id: string;
  name: string;
  quote: string;
  created_at: string;
}

const Admin = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoadingRequests(true);
      try {
        const { data, error } = await supabase.from("request_quotes").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (data) setQuoteRequests(data);
      } catch (error: any) {
        toast({
          title: "Error fetching quote requests",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoadingRequests(false);
      }
    };
    
    fetchRequests();
  }, [toast]);

  const { 
    quotes, 
    categories, 
    loading, 
    addQuote, 
    updateQuote, 
    deleteQuote, 
    addCategory, 
    updateCategory, 
    deleteCategory
  } = useQuotes();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [deleteQuoteId, setDeleteQuoteId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const inventoryQuotes = useMemo(() => quotes.filter(q => q.status === 'draft'), [quotes]);

  const handlePublishQuote = async (quote: Quote) => {
    await updateQuote(quote.id, { ...quote, status: 'published' });
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredQuotes = quotes.filter(quote => {
    if (quote.status !== 'published') return false;
    const matchesSearch = 
      quote.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      selectedCategory === "all" || 
      quote.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddQuote = async (quoteData: Partial<Quote>) => {
    setFormLoading(true);
    const dataWithStatus = { ...quoteData, status: 'draft' };
    await addQuote(dataWithStatus as Quote);
    setFormLoading(false);
    setShowQuoteForm(false);
  };

  const handleUpdateQuote = async (quoteData: Partial<Quote>) => {
    if (!editingQuote) return;
    setFormLoading(true);
    await updateQuote(editingQuote.id, quoteData);
    setFormLoading(false);
    setShowQuoteForm(false);
    setEditingQuote(null);
  };

  const handleDeleteQuote = async () => {
    if (!deleteQuoteId) return;
    await deleteQuote(deleteQuoteId);
    setDeleteQuoteId(null);
  };

  const handleAddCategory = async (data: { name: string; description?: string }) => {
    setFormLoading(true);
    await addCategory(data);
    setFormLoading(false);
    setShowCategoryForm(false);
  };

  const handleUpdateCategory = async (data: { name: string; description?: string }) => {
    if (!editingCategory) return;
    setFormLoading(true);
    await updateCategory(editingCategory.id, data);
    setFormLoading(false);
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    await deleteCategory(deleteCategoryId);
    setDeleteCategoryId(null);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setShowQuoteForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage quotes and categories</p>
        </div>

        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="quotes">Quotes Management</TabsTrigger>
            <TabsTrigger value="quoteRequests">Quote Requests</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Storage</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quoteRequests" className="space-y-6">
            <h2 className="text-xl font-semibold">Quote Requests</h2>
            {loadingRequests ? (
              <div className="text-center py-8">Loading...</div>
            ) : quoteRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No quote requests found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quoteRequests.map((req) => (
                  <div key={req.id} className="border rounded-lg p-4 bg-background shadow flex flex-col gap-2">
                    <div className="font-bold text-lg">{req.name}</div>
                    <div className="text-muted-foreground">{new Date(req.created_at).toLocaleString()}</div>
                    <div className="mb-2">{req.quote}</div>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        await addQuote({
                          quote: req.quote,
                          author: req.name,
                          category_id: null,
                          status: 'draft'
                        } as Quote);
                        await supabase.from("request_quotes").delete().eq("id", req.id);
                        setQuoteRequests((prev) => prev.filter((r) => r.id !== req.id));
                      }}
                    >
                      Add to Quotes
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Inventory Storage</h2>
              <Button onClick={() => setShowQuoteForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add to Inventory
              </Button>
            </div>
            {inventoryQuotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No draft quotes found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventoryQuotes.map((quote) => (
                  <Card key={quote.id}>
                    <CardHeader>
                      <CardTitle>{quote.author}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{quote.quote}</p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handlePublishQuote(quote)}>Publish</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quotes" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={() => setShowQuoteForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Quote
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Badge variant="outline">
                {filteredQuotes.length} quotes displayed
              </Badge>
              <Badge variant="outline">
                {quotes.length} total quotes
              </Badge>
            </div>

            {filteredQuotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No quotes found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuotes.map((quote) => (
                  <QuoteCard 
                    key={quote.id} 
                    quote={quote} 
                    isAdmin={true}
                    onEdit={handleEditQuote}
                    onDelete={setDeleteQuoteId}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Categories Management</h2>
              <Button onClick={() => {
                setEditingCategory(null);
                setShowCategoryForm(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      {category.name}
                    </CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Badge variant="secondary">
                      {quotes.filter(q => q.category_id === category.id).length} quotes
                    </Badge>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteCategoryId(category.id)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <h2 className="text-xl font-semibold">Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{quotes.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{categories.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average per Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {categories.length ? Math.round(quotes.length / categories.length) : 0}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <QuoteForm
          open={showQuoteForm}
          onOpenChange={(open) => {
            setShowQuoteForm(open);
            if (!open) setEditingQuote(null);
          }}
          onSubmit={editingQuote ? handleUpdateQuote : handleAddQuote}
          categories={categories}
          editingQuote={editingQuote}
          loading={formLoading}
        />

        <CategoryForm
          open={showCategoryForm}
          onOpenChange={(open) => {
            setShowCategoryForm(open);
            if (!open) setEditingCategory(null);
          }}
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          editingCategory={editingCategory}
          loading={formLoading}
        />

        <AlertDialog open={!!deleteQuoteId} onOpenChange={() => setDeleteQuoteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Quote</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this quote? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteQuote} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this category? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Admin;