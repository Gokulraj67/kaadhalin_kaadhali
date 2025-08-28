import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuotes } from "@/hooks/useQuotes";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

const Home = () => {
  const { quotes, categories, loading } = useQuotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      quote.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading quotes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
           ✨ Kadhalin_kaadhali ✨
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            இதயம் தொடும் வார்த்தைகள், உயிர் நிறைக்கும் சிந்தனைகள்...

இங்கு என் மனதில் பிறந்த மேற்கோள்களும், உங்களால் பகிரப்படும் உணர்வுகளும் ஒன்றாக சேர்கின்றன.
அன்பு, நட்பு, வாழ்க்கை, கனவு, ஊக்கம் என எல்லா தருணங்களுக்கும் உரிய மேற்கோள்கள் இங்கு இடம்பெறும்.

உங்களது சொற்கள் மற்றொருவரின் இதயத்தைத் தொட்டுச் செல்லட்டும்.
Kadhalin_kaadhali – உங்கள் உணர்வுகளை வார்த்தைகளால் உயிர்ப்பிக்கும் இடம். ❤️
          </p>
          <Link
            to="/request-quote"
            className="inline-block cursor-pointer font-semibold px-4 py-2 rounded bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 text-white shadow-md hover:scale-105 transition-transform"
            tabIndex={0}
            role="button"
            aria-label="Add your own quote"
          >
           📝 உங்கள் எண்ணங்களை பகிருங்கள்!
இப்போது நீங்கள் விரும்பும் மேற்கோள்களை Kadhalin_kaadhali-யில் நேரடியாகச் சேர்க்கலாம்.
அன்பு, நட்பு, வாழ்க்கை, கனவு, ஊக்கம்… எந்த உணர்வாக இருந்தாலும்,
உங்கள் வார்த்தைகள் மற்றவரின் இதயத்தைத் தொட்டுச் செல்லும். <u>உங்கள் Quotes-ஐ சேர்த்து, உலகத்துடன் பகிருங்கள்!</u>
          </Link>
        </div>

        {/* Search and Filter */}
  <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quotes, authors, or descriptions..."
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

        {/* Stats */}
  <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <Badge variant="outline" className="text-sm">
            {filteredQuotes.length} quotes found
          </Badge>
          <Badge variant="outline" className="text-sm">
            {categories.length} categories
          </Badge>
        </div>

        {/* Quotes Grid */}
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm || selectedCategory !== "all" 
                ? "No quotes found matching your criteria" 
                : "No quotes available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;