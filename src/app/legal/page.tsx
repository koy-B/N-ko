import Link from "next/link"
import { ChevronLeft, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container max-w-4xl">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/" />}
          className="mb-8"
        >
          <ChevronLeft className="size-4" />
          Retour à l'accueil
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Scale className="size-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Mentions Légales</h1>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Édition du site</h2>
            <p>
              Le site <strong>Néko</strong> est édité par la société <strong>Néko Green</strong>, société anonyme au capital de 10.000.000 FCFA, dont le siège social est situé à Abidjan, Côte d'Ivoire.
            </p>
            <p>
              Directeur de la publication : Gafar Sanusi
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Hébergement</h2>
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong>, situé au 440 N Barranca Ave #4133 Covina, CA 91723.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. Propriété intellectuelle</h2>
            <p>
              L'intégralité du contenu du site Néko (textes, images, graphismes, logo, icônes, etc.) est la propriété exclusive de Néko Green, sauf mention contraire. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de Néko Green.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Données personnelles</h2>
            <p>
              Pour toute information liée à la collecte et au traitement de vos données personnelles, nous vous invitons à consulter notre <Link href="/privacy" className="text-primary hover:underline">Politique de Confidentialité</Link>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Contact</h2>
            <p>
              Pour toute question ou demande d'information concernant le site, ou toute notification de contenu inapproprié ou illégal, vous pouvez nous contacter à l'adresse suivante : <strong>contact@nekogreen.ci</strong>.
            </p>
          </section>

          <section className="pt-8 border-t">
            <p className="text-sm italic">
              Dernière mise à jour : 1er juin 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
