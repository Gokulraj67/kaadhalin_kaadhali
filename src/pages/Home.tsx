import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuotes } from "@/hooks/useQuotes";
import { QuoteCard } from "@/components/QuoteCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container px-4 sm:px-6 lg:px-8 py-8">
        <section className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
           ✨ Kadhalin Kaadhali ✨
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            இதயம் தொடும் வார்த்தைகள், உயிர் நிறைக்கும் சிந்தனைகள்... இங்கு என் மனதில் பிறந்த மேற்கோள்களும், உங்களால் பகிரப்படும் உணர்வுகளும் ஒன்றாக சேர்கின்றன. அன்பு, நட்பு, வாழ்க்கை, கனவு, ஊக்கம் என எல்லா தருணங்களுக்கும் உரிய மேற்கோள்கள் இங்கு இடம்பெறும். உங்களது சொற்கள் மற்றொருவரின் இதயத்தைத் தொட்டுச் செல்லட்டும். Kadhalin Kaadhali – உங்கள் உணர்வுகளை வார்த்தைகளால் உயிர்ப்பிக்கும் இடம். ❤️
          </p>
          <Link
            to="/request-quote"
            className="inline-block mt-6 font-semibold px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white shadow-lg hover:scale-105 transition-transform duration-300"
            tabIndex={0}
            role="button"
            aria-label="Add your own quote"
          >
            📝 உங்கள் எண்ணங்களை பகிருங்கள்!
          </Link>
        </section>

        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search quotes, authors, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-12 text-base">
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

          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="outline" className="text-sm font-medium py-1 px-3">
              {filteredQuotes.length} quotes found
            </Badge>
            <Badge variant="outline" className="text-sm font-medium py-1 px-3">
              {categories.length} categories
            </Badge>
          </div>
        </section>

        <section>
          {loading ? (
            renderSkeletons()
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {searchTerm || selectedCategory !== "all" 
                  ? "No quotes found matching your criteria" 
                  : "No quotes available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredQuotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
