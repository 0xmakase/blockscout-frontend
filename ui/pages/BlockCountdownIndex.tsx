import { chakra, Box, Center, Heading, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import FilterInput from 'ui/shared/filters/FilterInput';
import IconSvg from 'ui/shared/IconSvg';

const BlockCountdownIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const iconColor = useColorModeValue('gray.300', 'gray.600');

  const handleFormSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const searchTerm = formData.get('search_term');
    if (typeof searchTerm === 'string' && searchTerm) {
      router.push({ pathname: '/block/countdown/[height]', query: { height: searchTerm } }, undefined, { shallow: true });
    }
  }, [ router ]);

  return (
    <Center h="100%" justifyContent={{ base: 'flex-start', lg: 'center' }} flexDir="column" textAlign="center" pt={{ base: 8, lg: 0 }}>
      <IconSvg name="block_countdown" color={ iconColor } w={{ base: '160px', lg: '240px' }} h={{ base: '123px', lg: '184px' }}/>
      <Heading
        fontSize={{ base: '18px', lg: '32px' }}
        lineHeight={{ base: '24px', lg: '40px' }}
        h={{ base: '24px', lg: '40px' }}
        mt={{ base: 3, lg: 6 }}
      >
        { t('blockCountdownIndex.heading') }
      </Heading>
      <Box mt={ 2 }>
        { t('blockCountdownIndex.description') }
      </Box>
      <chakra.form
        noValidate
        onSubmit={ handleFormSubmit }
        w={{ base: '100%', lg: '360px' }}
        mt={{ base: 3, lg: 6 }}
      >
        <FilterInput
          placeholder={ t('blockCountdownIndex.searchPlaceholder') }
          size="xs"
          type="number"
          name="search_term"
        />
      </chakra.form>
    </Center>
  );
};

export default React.memo(BlockCountdownIndex);
