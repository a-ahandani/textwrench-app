import { Card, CardRootProps } from '@chakra-ui/react'
import { ReactNode, ReactElement } from 'react'

export interface SettingCardProps extends CardRootProps {
  children: ReactNode
}

export const SettingCard = ({
  children,
  variant = 'subtle',
  ...rest
}: SettingCardProps): ReactElement => {
  return (
    <Card.Root variant={variant} my={2} {...rest}>
      {children}
    </Card.Root>
  )
}

SettingCard.Body = Card.Body as typeof Card.Body
SettingCard.Footer = Card.Footer as typeof Card.Footer
SettingCard.Title = Card.Title as typeof Card.Title
SettingCard.Description = Card.Description as typeof Card.Description
