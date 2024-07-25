import type { NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'react-i18next';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
import SwaggerUI from 'ui/apiDocs/SwaggerUI';
import PageTitle from 'ui/shared/Page/PageTitle';

const Page: NextPage = () => {
  const { t } = useTranslation();

  return (
    <PageNextJs pathname="/api-docs">
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } ${ t('pageTitle.apiDocs') }` : t('pageTitle.apiDocs') }
      />
      <SwaggerUI/>
    </PageNextJs>
  );
};

export default Page;

export { apiDocs as getServerSideProps } from 'nextjs/getServerSideProps';
