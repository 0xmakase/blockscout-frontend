import {
  Link,
  chakra,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useColorModeValue,
  DarkMode,
  ListItem,
  OrderedList,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig, SmartContractVerificationMethod } from 'types/api/contract';

import useIsMobile from 'lib/hooks/useIsMobile';
import Popover from 'ui/shared/chakra/Popover';
import FancySelect from 'ui/shared/FancySelect/FancySelect';
import IconSvg from 'ui/shared/IconSvg';

import { METHOD_LABELS } from '../utils';

interface Props {
  control: Control<FormFields>;
  isDisabled?: boolean;
  methods: SmartContractVerificationConfig['verification_options'];
}

const ContractVerificationFieldMethod = ({ control, isDisabled, methods }: Props) => {
  const { t } = useTranslation();
  const tooltipBg = useColorModeValue('gray.700', 'gray.900');
  const isMobile = useIsMobile();

  const options = React.useMemo(() => methods.map((method) => ({
    value: method,
    label: METHOD_LABELS[method],
  })), [ methods ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'method'>}) => {
    return (
      <FancySelect
        { ...field }
        options={ options }
        size={ isMobile ? 'md' : 'lg' }
        placeholder="Verification method (compiler type)"
        isDisabled={ isDisabled }
        isRequired
        isAsync={ false }
      />
    );
  }, [ isDisabled, isMobile, options ]);

  const renderPopoverListItem = React.useCallback((method: SmartContractVerificationMethod) => {
    switch (method) {
      case 'flattened-code':
        return <ListItem key={ method }>{ t('contractVerification.flattened_code') }</ListItem>;
      case 'multi-part':
        return <ListItem key={ method }>{ t('contractVerification.multi_part') }</ListItem>;
      case 'sourcify':
        return <ListItem key={ method }>{ t('contractVerification.sourcify') } <Link href="https://sourcify.dev/" target="_blank">Sourcify</Link>.</ListItem>;
      case 'standard-input':
        return (
          <ListItem key={ method }>
            { t('contractVerification.standard_input') } <Link
              href="https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description"
              target="_blank"
            >
              Standard input JSON
            </Link>
            <span> file.</span>
          </ListItem>
        );
      case 'vyper-code':
        return <ListItem key={ method }>{ t('contractVerification.vyper_code') }</ListItem>;
      case 'vyper-multi-part':
        return <ListItem key={ method }>{ t('contractVerification.vyper_multi_part') }</ListItem>;
      case 'vyper-standard-input':
        return (
          <ListItem key={ method }>
            { t('contractVerification.vyper_standard_input') } <Link
              href="https://docs.vyperlang.org/en/stable/compiling-a-contract.html#compiler-input-and-output-json-description"
              target="_blank"
            >
              Standard input JSON
            </Link>
            <span> file.</span>
          </ListItem>
        );
    }
  }, [ t ]);

  return (
    <>
      <Box mt={{ base: 10, lg: 6 }} gridColumn={{ lg: '1 / 3' }}>
        <chakra.span fontWeight={ 500 } fontSize="lg" fontFamily="heading">
          { t('contractVerification.supported_methods', { count: methods.length }) }
        </chakra.span>
        <Popover trigger="hover" isLazy placement={ isMobile ? 'bottom-end' : 'right-start' } offset={ [ -8, 8 ] }>
          <PopoverTrigger>
            <chakra.span display="inline-block" ml={ 1 } cursor="pointer" verticalAlign="middle" h="22px">
              <IconSvg name="info" boxSize={ 5 } color="icon_info" _hover={{ color: 'link_hovered' }}/>
            </chakra.span>
          </PopoverTrigger>
          <Portal>
            <PopoverContent bgColor={ tooltipBg } w={{ base: '300px', lg: '380px' }}>
              <PopoverArrow bgColor={ tooltipBg }/>
              <PopoverBody color="white">
                <DarkMode>
                  <span>{ t('contractVerification.supported_methods_list', { count: methods.length }) }</span>
                  <OrderedList>
                    { methods.map(renderPopoverListItem) }
                  </OrderedList>
                </DarkMode>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Box>
      <Controller
        name="method"
        control={ control }
        render={ renderControl }
        rules={{ required: true }}
      />
    </>
  );
};

export default React.memo(ContractVerificationFieldMethod);
