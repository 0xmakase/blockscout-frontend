import { Flex, IconButton, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import FormFieldAddress from 'ui/shared/forms/fields/FormFieldAddress';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';
import IconSvg from 'ui/shared/IconSvg';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const LIMIT = 10;

interface Props {
  index: number;
  fieldsLength: number;
  onAddFieldClick: (index: number) => void;
  onRemoveFieldClick: (index: number) => void;
  isDisabled?: boolean;
}

const ContractVerificationFieldLibraryItem = ({ index, fieldsLength, onAddFieldClick, onRemoveFieldClick, isDisabled }: Props) => {
  const { t } = useTranslation();
  const ref = React.useRef<HTMLDivElement>(null);

  const handleAddButtonClick = React.useCallback(() => {
    onAddFieldClick(index);
  }, [ index, onAddFieldClick ]);

  const handleRemoveButtonClick = React.useCallback(() => {
    onRemoveFieldClick(index);
  }, [ index, onRemoveFieldClick ]);

  React.useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <ContractVerificationFormRow>
        <Flex alignItems="center" justifyContent="space-between" ref={ ref } mt={ index !== 0 ? 6 : 0 }>
          <Text variant="secondary" fontSize="sm">
            { t('contractVerificationFieldLibraryItem.contractLibrary', { index: index + 1 }) }
          </Text>
          <Flex columnGap={ 5 }>
            { fieldsLength > 1 && (
              <IconButton
                aria-label={ t('contractVerificationFieldLibraryItem.delete') }
                variant="outline"
                w="30px"
                h="30px"
                onClick={ handleRemoveButtonClick }
                icon={ <IconSvg name="minus" w="20px" h="20px"/> }
                isDisabled={ isDisabled }
              />
            ) }
            { fieldsLength < LIMIT && (
              <IconButton
                aria-label={ t('contractVerificationFieldLibraryItem.add') }
                variant="outline"
                w="30px"
                h="30px"
                onClick={ handleAddButtonClick }
                icon={ <IconSvg name="plus" w="20px" h="20px"/> }
                isDisabled={ isDisabled }
              />
            ) }
          </Flex>
        </Flex>
      </ContractVerificationFormRow>
      <ContractVerificationFormRow>
        <FormFieldText<FormFields, `libraries.${ number }.name`>
          name={ `libraries.${ index }.name` }
          isRequired
          rules={{ maxLength: 255 }}
          placeholder="Library name (.sol file)"
          size={{ base: 'md', lg: 'lg' }}
        />
        { index === 0 ? (
          <Text>{ t('contractVerificationFieldLibraryItem.libraryNameDescription') }</Text>
        ) : null }
      </ContractVerificationFormRow>
      <ContractVerificationFormRow>
        <FormFieldAddress<FormFields, `libraries.${ number }.address`>
          name={ `libraries.${ index }.address` }
          isRequired
          placeholder="Library address (0x...)"
          size={{ base: 'md', lg: 'lg' }}
        />
        { index === 0 ? (
          <>{ t('contractVerificationFieldLibraryItem.libraryAddressDescription') }</>
        ) : null }
      </ContractVerificationFormRow>
    </>
  );
};

export default React.memo(ContractVerificationFieldLibraryItem);
