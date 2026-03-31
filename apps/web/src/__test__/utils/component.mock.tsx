import { createElement, type ReactNode } from 'react'

const serializeProps = (props: Record<string, unknown>) =>
  JSON.stringify(props, (_key, value) => {
    if (typeof value === 'function') return '[function]'
    return value
  })

export const createMockComponent = (name: string) => {
  const MockComponent = ({
    children,
    ...props
  }: {
    children?: ReactNode
    [key: string]: unknown
  }) =>
    createElement(
      'div',
      {
        'data-props': serializeProps(props),
        'data-testid': name,
      },
      children
    )

  MockComponent.displayName = name

  return MockComponent
}

export const getMockProps = (element: HTMLElement) => JSON.parse(element.dataset.props ?? '{}')
