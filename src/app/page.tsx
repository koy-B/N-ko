import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/landing/hero"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { ImpactSection } from "@/components/landing/impact"
import { ProductsPreviewSection } from "@/components/landing/products-preview"
import { StatsSection } from "@/components/landing/stats"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { FAQSection } from "@/components/landing/faq-section"
import { ContactSection } from "@/components/landing/contact-section"
import { BlogPreviewSection } from "@/components/landing/blog-preview"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ImpactSection />
        <StatsSection />
        <ProductsPreviewSection />
        <TestimonialsSection />
        <FAQSection />
        <BlogPreviewSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
