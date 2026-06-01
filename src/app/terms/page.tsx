import Link from "next/link"
import { ChevronLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
            <FileText className="size-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Conditions Générales d'Utilisation</h1>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p className="text-lg">
              Bienvenue sur Néko. En accédant à notre plateforme, vous acceptez de respecter et d'être lié par les présentes conditions générales d'utilisation.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Objet du service</h2>
            <p>
              Néko fournit une plateforme mettant en relation des clients souhaitant recycler leurs déchets plastiques avec des collecteurs, et propose la vente de produits fabriqués à partir de ces matières recyclées.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Inscription et Compte</h2>
            <p>
              Pour utiliser certains services, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de vos identifiants et de toutes les activités effectuées sous votre compte. Vous vous engagez à fournir des informations exactes et à jour.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. Utilisation de la plateforme</h2>
            <p>
              Vous vous engagez à ne pas utiliser la plateforme à des fins illégales ou interdites par ces CGU. Il est interdit de :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tenter d'accéder sans autorisation aux systèmes de Néko</li>
              <li>Publier du contenu offensant, diffamatoire ou inapproprié</li>
              <li>Perturber le bon fonctionnement de la plateforme</li>
              <li>Collecter des données sur d'autres utilisateurs sans leur consentement</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu présent sur la plateforme (textes, graphiques, logos, icônes, images) est la propriété exclusive de Néko ou de ses partenaires et est protégé par les lois internationales sur la propriété intellectuelle.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Limitation de responsabilité</h2>
            <p>
              Néko s'efforce de maintenir la plateforme accessible 24h/24. Cependant, nous ne pouvons être tenus responsables des interruptions de service dues à la maintenance ou à des problèmes techniques hors de notre contrôle.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Modification des conditions</h2>
            <p>
              Néko se réserve le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur la plateforme.
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
