import Link from 'next/link'
import Image from 'next/image'
import { api } from "~/trpc/server";

import { getServerAuthSession } from "~/server/auth";
import { ButtonPrimary } from "./_components/ButtonPrimary";
import { ButtonSecondary } from "./_components/ButtonSecondary";
import { env } from "~/env";
import CreateIcon from '@mui/icons-material/Create';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import { getHrefToPost } from './_utils/global.utils';

const STEPS = [
  {
    id: 1,
    title: 'Twórz Świetne Treści',
    description: `Odkryj swoją kreatywność! Na ${env.SITE_NAME} możesz łatwo dodawać nowe treści - artykuły, zdjęcia, wideo. Wszystko, co masz w głowie, możesz przekształcić w atrakcyjne treści online.`,
    getIcon: () => <CreateIcon className="text-primary" />, 
  },
  {
    id: 2,
    title: 'Buduj Społeczność, Zdobywaj Fanów',
    description: 'Rozwijaj swoją społeczność online! Interaguj z fanami, odpowiadaj na komentarze, i dziel się swoimi pomysłami. Im silniejsza społeczność, tym większe szanse na sukces.',
    getIcon: () => <GroupIcon className="text-primary" />, 
  },
  {
    id: 3,
    title: 'Zarabiaj Na Tym, Co Kochasz',
    description: `Twoja pasja może być źródłem dochodów! Dzięki ${env.SITE_NAME} łatwo zarabiasz. Oferujemy różne sposoby - subskrypcje, płatności za treści, partnerstwa afiliacyjne. Wystarczy, że robisz to, co kochasz.`,
    getIcon: () => <AttachMoneyIcon className="text-primary" />, 
  },
]

type SectionProps = {
  header: string
  description: string
  children?: React.ReactNode
  isReversed?: boolean
}

const Section = ({
  header,
  description,
  children,
  isReversed,
}: SectionProps) => {
  return (
    <section className={`flex gap-12 items-center flex-col xl:flex-row ${isReversed ? 'xl:flex-row-reverse' : ''}`}>
      <div className="flex flex-1 flex-col box-border py-24 gap-4">
        <h2 className="m-0">{header}</h2>
        <p className="m-0">
          {description}
        </p>
        {children &&
          <div className="flex gap-4 box-border">
            {children}
          </div>
        }
      </div>
      <div className="flex flex-1 h-full relative">
        <Image
          src="/images/talking-people.jpg"
          fill
          objectFit='cover'
          alt={env.SITE_NAME}
          className="rounded-lg"
          objectPosition='top'
        />
      </div>
    </section>
  )
}

export default async function Home() {
  const session = await getServerAuthSession();
  const { posts } = await api.post.getPosts.query({ take: 7 });

  const signInOrDashboardHref = session ? '/dashboard' : '/api/auth/signin'
  const signInText = session ? 'Zobacz konto' : 'Zaczynajmy'

  return (
    <div className="flex flex-1 flex-col gap-12">
      <Section
        header="Zmonetyzuj swoją wiedze"
        description={`Witaj w ${env.SITE_NAME} - miejscu, gdzie Twoja wiedza staje się źródłem zasłużonych dochodów. Teraz masz szansę przekształcić swoją pasję, umiejętności i treści w realne zarobki. Nasza platforma oferuje innowacyjne rozwiązania dla blogerów, twórców treści oraz stron sportowych, umożliwiając im maksymalizację potencjału.`}
      >
        <ButtonPrimary href={signInOrDashboardHref}>
          {signInText}
        </ButtonPrimary>
        <ButtonSecondary href="/blog">
          Czytaj dalej
        </ButtonSecondary>
      </Section>
      <section className="flex flex-1 flex-col text-center">
        <h2 className="flex flex-1">Zobacz jakie to proste</h2>
        <div className="flex flex-1 gap-12 flex-col xl:flex-row">
          {STEPS.map(({ id, title, description, getIcon }) => (
            <div key={id} className="flex items-center flex-1 border-solid border-[1px] border-tertiary rounded-lg flex-col gap-6 p-6">
              <div className="rounded-r-lg bg-secondary p-6">
                {getIcon()}
              </div>
              <p className="flex m-0 font-bold">
                {title}
              </p>
              <p className="flex flex-1 m-0">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
      <Section
        isReversed
        header="Jesteśmy Tutaj, Żeby Ci Pomóc"
        description={`Na ${env.SITE_NAME} nie zostawiamy Cię samego. Naszym celem jest sprawić, aby korzystanie z platformy było jak najprostsze. Bez zbędnych komplikacji, bez niepotrzebnego zamieszania - po prostu twórz, buduj społeczność i zarabiaj. Jesteśmy tutaj, aby Ci to ułatwić.`}
      >
        <ButtonPrimary href={signInOrDashboardHref}>
          {signInText}
        </ButtonPrimary>
      </Section>
      <Section
        header="Przejrzyste Zasady, Zero Niespodzianek"
        description={`${env.SITE_NAME} to miejsce, gdzie klarowność to priorytet. Cała nasza platforma jest dostępna dla Ciebie bez żadnych opłat - twórz, buduj społeczność, zarabiaj, wszystko bezpłatnie.`}
      >
        <ButtonPrimary href={signInOrDashboardHref}>
          {signInText}
        </ButtonPrimary>
      </Section>
      <Section
        isReversed
        header="Przejrzyste Zasady, Zero Niespodzianek"
        description={`${env.SITE_NAME} to miejsce, gdzie klarowność to priorytet. Cała nasza platforma jest dostępna dla Ciebie bez żadnych opłat - twórz, buduj społeczność, zarabiaj, wszystko bezpłatnie.`}
      >
        <ButtonPrimary href={signInOrDashboardHref}>
          {signInText}
        </ButtonPrimary>
      </Section>
      <section>
        <div className="flex justify-between items-center">
          <h2>Czerp Wiedze Od Innych</h2>
          <ButtonPrimary href="/wpisy">
            Zobacz pozostałe
          </ButtonPrimary>
        </div>
        <div className="flex flex-1 gap-9 flex-col lg:flex-row">
          <div className="flex flex-1 items-center gap-9 flex-col lg:flex-row">
            {posts.slice(0, 2).map(post => (
              <Link key={post.id} href={getHrefToPost(post)} className="no-underline text-black	flex flex-1 flex-col w-full h-full">
                <div className="flex relative flex-1 h-full">
                  <Image
                    src="/images/talking-people.jpg"
                    fill
                    objectFit='cover'
                    alt={env.SITE_NAME}
                    className="rounded-lg"
                    objectPosition='top'
                  />
                </div>
                <h3 className="text-base font-normal line-clamp-2">{post.title}</h3>
              </Link>
            ))}
          </div>
          <div>
            {posts.slice(2).map((post, index) => (
              <Link
                key={post.id}
                href={getHrefToPost(post)}
                className={`no-underline text-black flex lg:max-w-96 items-center ${index !== 0 ? 'border-solid border-x-0 border-b-0 border-t-[1px] border-tertiary' : ''}`}
              >
                <h3 className="text-base font-normal line-clamp-2">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="hidden lg:flex flex-1 min-h-[512px] relative">
        <Image
          src="/images/talking-people.jpg"
          fill
          objectFit='cover'
          alt={env.SITE_NAME}
          className="rounded-lg"
          objectPosition='top'
        />
        <div className="flex absolute bottom-0 bg-primary flex-1 justify-between w-full p-6 items-center text-white font-bold">
          <div>
            Jesteś gotowy, żeby odmienić swoje życie?
          </div>
          <ButtonSecondary href={signInOrDashboardHref}>
          {signInText}
          </ButtonSecondary>
        </div>
      </section>
    </div>
  );
}
