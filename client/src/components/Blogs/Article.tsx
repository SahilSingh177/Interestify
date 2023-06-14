import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Flex,
  Heading,
  Badge,
  Text,
  VStack,
  HStack,
  Divider,
  Spacer,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment as regularComment,
  faBookmark as regularBookmark,
  faThumbsUp as regularThumbsup
} from '@fortawesome/free-regular-svg-icons';

import {
  faBookmark as solidBookMark,
  faThumbsUp as solidThumbsUp
} from '@fortawesome/free-solid-svg-icons';

import AuthorCard from '../Author/AuthorCard';


type Props = {}

const Article: React.FC = (props: Props) => {
  const [articleProgress, setArticleProgress] = useState<number>(0);

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Time spent on page: ${duration} milliseconds`);
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;

      setArticleProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const Router = useRouter();
  const [isLiked, setIsLiked] = useState<Boolean>(false); //liked or not should be fetched from backend
  const [isBookMarked, setIsBookMarked] = useState<Boolean>(false);

  const bookmarkArticle = () => {
    setIsBookMarked(!isBookMarked);
    if (isBookMarked) {
      const articleLink = Router.asPath;
      console.log("Bookmarked: ")
      console.log(articleLink);
      //Backend request
    }
  }
  const likeArticle = () => {
    setIsLiked(!isLiked);
    if (isLiked) {
      const articleLink = Router.asPath;
      console.log("Liked: ")
      console.log(articleLink);
      //Backend request
    }
  }

  return (
    <VStack spacing={5} alignItems="flex-start" width="55vw" maxWidth="100vw" minHeight={`calc(100vh - 80px)`}
      marginLeft="5vw" marginRight="5vw" marginTop={`calc(80px + 5vh)`} bg="whiteAlpha.500" overflowX='hidden'>
      <CircularProgress position="fixed" bottom='2vh' left='2vh' value={Math.floor(articleProgress)} color='green.400'>
        <CircularProgressLabel>{Math.floor(articleProgress)}</CircularProgressLabel>
      </CircularProgress>
      <Heading color="gray.700">I Used ChatGPT (Every Day) for 5 Months. Here Are Some Hidden Gems That Will Change Your Life</Heading>
      <Heading as='h3' size="md" fontWeight="semibold" color='gray.600'>Transform your life with these ChatGPT’s hidden gems.</Heading>
      <AuthorCard></AuthorCard>
      <Divider bg="gray.400" borderColor="gray.600" />
      <HStack spacing={5} paddingLeft={5} paddingRight={5} width="100%">
        <FontAwesomeIcon icon={isLiked ? solidThumbsUp : regularThumbsup} size='lg' cursor='pointer' onClick={likeArticle} />
        <FontAwesomeIcon icon={regularComment} size='lg' cursor='pointer' />
        <Spacer />
        <FontAwesomeIcon icon={isBookMarked ? solidBookMark : regularBookmark} size='lg' cursor='pointer' onClick={bookmarkArticle} />
      </HStack>
      <Divider bg="gray.400" borderColor="gray.600" />
      <Text lineHeight={2} padding={5} overflowX='hidden'>
        The Tech side of startups can sometimes be very fluid and contain a lot of unknowns. What tech stack to use? Which components might be overkill for now but worth keeping an eye on in the future? How to balance the pace of business features development while keeping the quality bar high enough to have a maintainable codebase?

        Here I want to share our experience building https://cleanbee.syzygy-ai.com/ from the ground up — how we shaped our processes based on needs and how our processes evolved as we extended our tech stack with new components.

        Businesses want to conquer the market and engineers — try cool stuff and stretch their brains. Meanwhile, the industry produces new languages, frameworks, and libraries in such quantities that you will not be able to check them all. And, usually, if you scratch the shiny surface of the Next Big Thing, you will find a good old concept. Good, if you are lucky.

        One of the most exciting topics to argue about is the processes — whether you rely on trunk-based development, prefer a more monstrous GitHub flow, are a fan of mobbing, or find it more efficient to spend time in PR-based code reviews.

        I have experience working in an environment where artifacts were thrown away on users without any standardized process. In case of issues, developers had a lot of fun (nope!) trying to figure out what version of components was actually deployed.

        On another spectrum is the never-ending queue to CI. After you create PR you have to entertain yourself in the nearest 30 minutes by betting whether the CI cluster will find a resource to run tests over your changes. Sometimes the platform team introduces new, exciting, and useful features that might break compatibility with existing boilerplate for CI. These may result in failing all your checks at the last minute, after an hour of waiting.

        I strongly believe that, as usual, it all depends on team maturity, the kind of software you are building, and various business constraints, for example, the existence of error’s budget and the importance of time-to-market versus SLXs.

        I think what is important is to have some agreed processes in place that everyone is aware of and follows. It’s also important to have the bravery to challenge and change it if there is evidence of a better alternative.

        Start Shaping the Process
        What we have at the start:

        less than a dozen developers — in-house team and temporary contractors who want to and can work asynchronously
        completely greenfield project — no single line of code has been written yet. Requirements are vague, but they already started shaping into something
        tech-wise — the clear need for a backend that should talk with mobile clients
        some simple web frontend — static pages should be enough! (nope)
        We have started simple — code at GitHub and a PR-based flow with a single requirement — to have tickets splittable to be delivered in 1–3 days. This required some practice of story slicing, and it seems that a sense of visible fast progress is shown through the ability to move tickets to Done. This can be a great motivational factor for the team to onboard that idea.

        Linters and static analyzers to skip exciting discussions, such as how many arguments per method are too much (6!). We’ll gradually add auto-tests. We also try codesense. They have a very promising approach to highlighting important parts of code (those bits that changed frequently and should definitely have a higher maintainability bar!) and identifying complexity by looking at the level of nestness in the code. It is probably a bit expensive for startups initially, but 100% provides decent hints for engineers.

        On the architecture side of things, there was a temptation to dive deep into the wonderland of microservices. But looking at horrifying diagrams of connections between them from big players, the need to trace requests between them, it really seems a suicidal approach for teams in the early stage that want to move fast.

        Analysis of requirements allow us to detect three groups of job:

        core API with usual CRUD-like activities
        search and recommendations
        temporary workload that does something useful according to schedule (almost at a time with casual delays is OK)

        Choice of tech stack: situations when the time is a bit limited, and expectations are high. Use what you know and master (yeah, maybe for someone, it is boring technology). Hence, Fastapi, REST, stateless, Python, redis, and Postgres are our best friends (Yeah, we like Go and Rust, but we need to pay our dues a bit more!).

        With mobile clients, the situation was a bit different. We foresaw a lot of screens with states and interactions with remote services but not too much custom, platform-specific tweaking. Hence, the idea of having a single codebase for iOS and Android was very appealing.

        Nowadays, the choice of frameworks is really wide, but again, due to some experience with Flutter, we decided to give it a go. Within mobile development, one of the important aspects to better decide on is state management. Here, you will have a nice abundance of acronyms to be puzzled about from various languages and frameworks. Some include MVC, MVVM, VIPER, TCA, RIBs, BLOC, etc.

        Our motto starts with the most simple (*) solutions sufficient to support the necessary functionality. (*) Simple. Well, let’s put it this way, we think we understand it.

        However, we definitely made a mistake after building MVP because we decided to build on top instead of throwing it away. Hence, on one wonderful (nope!) sunny day, I questioned my sanity: after I commented out code, cleaned all possible caches, and still didn’t see my changes on a new screen. Yeah, the dead code should be removed!

        Start Building!
        After those initial formalities were settled, the next necessary thing was to be able to check client-server interactions.

        API contract is a great thing, but it will be much more obvious that something is wrong when a real server throws you a “schema validation error” or miserably fails with an HTTP 500 error code.

        Backend services were initially split into two groups — API monolith and Search and Recommender. The first contains more or less straightforward logic to interact with DB, and the second contains CPU-intensive computations that might require specific hardware configuration. Every service has its own scalability group.

        As we were still thinking about the rollout strategy (and arguing which domain to buy), the solution was simple: to minimize the struggles of mobile engineers in dealing with the backend, i.e., the alien stack. Let’s pack everything into docker.

        When we prepare everything to be deployable locally — mobile engineers can run docker-compose commands and have everything ready (after a few painful attempts that reveal flaws in documentation, but the real value of such exercises is to react to every “WTF!” and improve it).

        `Everything` is good, but what is the point of an API running on top of an empty DB? Manually entering necessary data shortly leads to depression (and the risk of increasing the duration of development cycles). Hence, we prepared a curated dataset that was inserted into the local DB to be able to play with. We also started using it for auto-tests. Win-win! Auth becomes less problematic in defining testing scenarios when you have dozens of dummy users with similar passwords!

        Try new things or choose third-party providers
        Dealing with new technology is always a bit dangerous. You and your team can’t know everything (and sometimes things that you think you know can full you, but that’s another story). And still, it is often required to assess and investigate something no one has touched.

        Payments, email, chat, SMS, notifications, analytics, etc. Every modern application usually represents business logics glued with several third-party providers.

        Our approach to choosing with whom we work — time-capped, try-to-build-with-it activities to try the most promising one chosen by features, supported languages, and, in the case of providers, pricing.

        How did we get into Terraform?
        The backend, a part of the DB, also should have some object/file storage. Sooner or later, we also should have DNS so that our services are ready to play with the big cruel world.

        The choice of cloud provider was purely based on existing expertise within the team. We already use AWS for other projects, so we decided to stick with it. For sure, it is possible to do everything in the AWS console, but as times go, things become a classic big ball of mud that everyone is terrified to touch, and no one remembers why this bit exists at all.

        OK, seems the paradigm of infrastructure as code can be handy here.

        Tooling-wise, choices are not so big — vendor-specific (AWS Cloud formation, Google Cloud (Deployment Manager, Azure Automation), terraform, and its rivals.

        Based on experience with terraform… you already got an idea of how we choose things?

        Yeah, the initial setup will take some time (and without control can easily become the same big ball of mud in TF as well), but at least it will have some documentation over infrastructure and visibility of WHY it is there. Another major advantage, whatever you manage through TF, will be updated automatically (well, when you or CI/CD run corresponding commands)
      </Text>
      <Flex flexWrap="wrap" marginTop={5} marginBottom={5}>
        <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">Startup</Badge>
        <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">Software Development</Badge>
        <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">Software Architecture</Badge>
        <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">Software Enginerring</Badge>
        <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">Software Programming</Badge>
      </Flex>
      <Divider bg="gray.400" borderColor="gray.600" />
      <HStack spacing={5} paddingLeft={5} paddingRight={5} width="100%">
      <FontAwesomeIcon icon={isLiked ? solidThumbsUp : regularThumbsup} size='lg' cursor='pointer' onClick={likeArticle} />
        <FontAwesomeIcon icon={regularComment} size='lg' cursor='pointer' />
        <Spacer />
        <FontAwesomeIcon icon={isBookMarked ? solidBookMark : regularBookmark} size='lg' cursor='pointer' />
      </HStack>
      <Divider bg="gray.400" borderColor="gray.600" marginBottom={10} />

    </VStack>

  )
}

export default Article