import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { useTranslation } from 'react-i18next';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
import ContentLoader from 'ui/shared/ContentLoader';
import PageTitle from 'ui/shared/Page/PageTitle';

const GraphQL = dynamic(() => import('ui/graphQL/GraphQL'), {
  loading: () => <ContentLoader/>,
  ssr: false,
});

const Page: NextPage = () => {
  const { t } = useTranslation();

  return (
    <PageNextJs pathname="/graphiql">
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ?
          `${ t('pageTitle.graphiQL') } ${ config.chain.name } ${ t('pageTitle.interface') }` :
          t('pageTitle.graphQLPlayground') }
      />
      <GraphQL/>
    </PageNextJs>
  );
};

export default Page;

export { graphIQl as getServerSideProps } from 'nextjs/getServerSideProps';
