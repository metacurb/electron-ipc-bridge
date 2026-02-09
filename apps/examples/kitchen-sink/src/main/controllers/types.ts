export type NestedPayload = {
  flag: boolean
  kind: PayloadKind
}

export enum PayloadKind {
  A = 'a',
  B = 'b',
  C = 'c'
}

export type ComplexPayload = {
  id: string
  count?: number
  nested: NestedPayload
  tags: string[]
  union: string | number
}

export type SimplePayload = {
  message: string
}
