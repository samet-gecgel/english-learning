import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              English Learning
            </h3>
            <p className="text-sm text-muted-foreground">
              Master English effectively with our comprehensive learning platform.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Learn</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/words" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Word List
                </Link>
              </li>
              <li>
                <Link href="/flashcards" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Flashcards
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Quiz
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Study Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Practice Tests
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} English Learning. Built with ❤️ for learning English.
          </p>
        </div>
      </div>
    </footer>
  )
} 