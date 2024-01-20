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
import { getHrefToPost } from './_utils/links.utils';

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

export default async function Home() {
  const session = await getServerAuthSession();
  const posts = await api.post.getPosts.query({});

  const signInOrDashboardHref = session ? '/dashboard' : '/api/auth/signin'
  const signInText = session ? 'Zobacz konto' : 'Zaczynajmy'

  return (
    <div className="flex flex-1 flex-col gap-12">
      asddasasddas
      <section className="flex items-center flex-col xl:flex-row">
        <div className="flex flex-1 flex-col box-border p-9">
          <h2>Zmonetyzuj swoją wiedze</h2>
          <p>
            Witaj w {env.SITE_NAME} - miejscu, gdzie Twoja wiedza staje się źródłem zasłużonych dochodów. Teraz masz szansę przekształcić swoją pasję, umiejętności i treści w realne zarobki. Nasza platforma oferuje innowacyjne rozwiązania dla blogerów, twórców treści oraz stron sportowych, umożliwiając im maksymalizację potencjału finansowego.
          </p>
          <div className="flex gap-4 box-border my-3">
            <ButtonPrimary href={signInOrDashboardHref}>
              {signInText}
            </ButtonPrimary>
            <ButtonSecondary href="/blog">
              Czytaj dalej
            </ButtonSecondary>
          </div>
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
      <section className="flex items-center">
        <div className="flex-1 h-full relative hidden lg:flex">
          <Image
            src="/images/talking-people.jpg"
            fill
            objectFit='cover'
            alt={env.SITE_NAME}
            className="rounded-lg"
            objectPosition='top'
          />
        </div>
        <div className="flex flex-1 flex-col box-border p-9">
          <h2>Jesteśmy Tutaj, Żeby Ci Pomóc</h2>
          <p>
            Na {env.SITE_NAME} nie zostawiamy Cię samego. Naszym celem jest sprawić, aby korzystanie z platformy było jak najprostsze. Bez zbędnych komplikacji, bez niepotrzebnego zamieszania - po prostu twórz, buduj społeczność i zarabiaj. Jesteśmy tutaj, aby Ci to ułatwić.
          </p>
          <div className="flex box-border my-3">
            <ButtonPrimary href={signInOrDashboardHref}>
              {signInText}
            </ButtonPrimary>
          </div>
        </div>
      </section>
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
                <h3 className="font-normal">{post.title}</h3>
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
                <h4 className="font-normal">{post.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="flex items-center">
        <div className="flex-1 h-full relative hidden lg:flex">
          <Image
            src="/images/talking-people.jpg"
            fill
            objectFit='cover'
            alt={env.SITE_NAME}
            className="rounded-lg"
            objectPosition='top'
          />
        </div>
        <div className="flex flex-1 flex-col box-border p-9">
          <h2>Przejrzyste Zasady, Zero Niespodzianek</h2>
          <p>
            {env.SITE_NAME} to miejsce, gdzie klarowność to priorytet. Cała nasza platforma jest dostępna dla Ciebie bez żadnych opłat - twórz, buduj społeczność, zarabiaj, wszystko bezpłatnie.
          </p>
          <div className="flex box-border my-3">
            <ButtonPrimary href={signInOrDashboardHref}>
              {signInText}
            </ButtonPrimary>
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
