import { Alert, Link, Text, chakra, useTheme, useColorModeValue, Skeleton, Tr, Td } from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface InjectedProps {
  content: React.ReactNode;
}

interface Props {
  type?: 'transaction' | 'token_transfer' | 'deposit' | 'block';
  children?: (props: InjectedProps) => JSX.Element;
  className?: string;
  url: string;
  alert?: string;
  num?: number;
  isLoading?: boolean;
}

const SocketNewItemsNotice = chakra(({ children, className, url, num, alert, type = 'transaction', isLoading }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const alertContent = (() => {
    if (alert) {
      return alert;
    }

    let name;
    const plural = num && num > 1 ? 's' : '';
    const plural2 = num && num > 1 ? 've' : 's';

    switch (type) {
      case 'token_transfer':
        name = t('socketNewItemsNotice.token_transfer');
        break;
      case 'deposit':
        name = t('socketNewItemsNotice.deposit');
        break;
      case 'block':
        name = t('socketNewItemsNotice.block');
        break;
      default:
        name = t('socketNewItemsNotice.transaction');
        break;
    }

    if (!num) {
      return t('socketNewItemsNotice.scanning', { name });
    }

    return (
      <>
        <Link href={ url }>{ t('socketNewItemsNotice.more', { num: num.toLocaleString(), name, plural }) }</Link>
        <Text whiteSpace="pre">{ t('socketNewItemsNotice.come_in', { name, plural2 }) }</Text>
      </>
    );
  })();

  const color = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  const bgColor = useColorModeValue('orange.50', transparentize('orange.200', 0.16)(theme));

  const content = !isLoading ? (
    <Alert
      className={ className }
      status="warning"
      px={ 4 }
      py="6px"
      fontWeight={ 400 }
      fontSize="sm"
      lineHeight={ 5 }
      bgColor={ bgColor }
      color={ color }
    >
      { alertContent }
    </Alert>
  ) : <Skeleton className={ className } h="33px"/>;

  return children ? children({ content }) : content;
});

export default SocketNewItemsNotice;

export const Desktop = ({ ...props }: Props) => {
  return (
    <SocketNewItemsNotice
      borderRadius={ props.isLoading ? 'sm' : 0 }
      h={ props.isLoading ? 5 : 'auto' }
      maxW={ props.isLoading ? '215px' : undefined }
      w="100%"
      mx={ props.isLoading ? 4 : 0 }
      my={ props.isLoading ? '6px' : 0 }
      { ...props }
    >
      { ({ content }) => <Tr><Td colSpan={ 100 } p={ 0 }>{ content }</Td></Tr> }
    </SocketNewItemsNotice>
  );
};

export const Mobile = ({ ...props }: Props) => {
  return (
    <SocketNewItemsNotice
      borderBottomRadius={ 0 }
      { ...props }
    />
  );
};
