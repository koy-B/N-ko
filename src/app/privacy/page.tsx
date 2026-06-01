import Link from "next/link"
import { ChevronLeft, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Politique de Confidentialité</h1>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p className="text-lg">
              Chez Néko, nous accordons une importance capitale à la protection de vos données personnelles. Cette politique détaille comment nous collectons, utilisons et protégeons vos informations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Collecte des informations</h2>
            <p>
              Nous collectons des informations lorsque vous vous inscrivez sur notre plateforme, passez une commande, programmez une collecte ou remplissez un formulaire de contact. Les informations collectées incluent votre nom, adresse e-mail, numéro de téléphone et adresse de collecte.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Utilisation des informations</h2>
            <p>
              Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
              <li>Améliorer notre plateforme et nos services de recyclage</li>
              <li>Améliorer le service client et vos besoins de prise en charge</li>
              <li>Vous contacter par e-mail ou téléphone pour le suivi de vos commandes ou collectes</li>
              <li>Administrer un concours, une promotion, ou une enquête</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. Protection des informations</h2>
            <p>
              Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne. Nous protégeons également vos informations hors ligne.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Divulgation à des tiers</h2>
            <p>
              Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers. Cela ne comprend pas les tierces parties de confiance qui nous aident à exploiter notre site Web ou à mener nos affaires, tant que ces parties conviennent de garder ces informations confidentielles.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Consentement</h2>
            <p>
              En utilisant notre site, vous consentez à notre politique de confidentialité.
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
