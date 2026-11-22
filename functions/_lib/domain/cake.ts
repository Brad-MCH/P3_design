export const SIZES = ['small', 'medium', 'large'] as const
export const FLAVORS = ['vanilla', 'chocolate', 'red_velvet', 'lemon'] as const
export const FROSTINGS = ['buttercream', 'cream_cheese', 'ganache'] as const
export const DESIGNS = ['classic', 'floral', 'birthday', 'minimal'] as const
export const EXTRAS = ['candles', 'fruit', 'macarons'] as const

export type CakeSize = (typeof SIZES)[number]
export type CakeFlavor = (typeof FLAVORS)[number]
export type Frosting = (typeof FROSTINGS)[number]
export type CakeDesign = (typeof DESIGNS)[number]
export type CakeExtra = (typeof EXTRAS)[number]

export interface CakeConfiguration {
  size: CakeSize
  flavor: CakeFlavor
  frosting: Frosting
  design: CakeDesign
  color: string
  message: string
  extras: CakeExtra[]
}

export interface CakePrice {
  description: string
  amount: number
}

const BASE_PRICES: Record<CakeSize, number> = {
  small: 12000,
  medium: 18000,
  large: 26000,
}
const FLAVOR_PRICES: Record<CakeFlavor, number> = {
  vanilla: 0,
  chocolate: 1500,
  red_velvet: 2500,
  lemon: 1000,
}
const FROSTING_PRICES: Record<Frosting, number> = {
  buttercream: 0,
  cream_cheese: 1500,
  ganache: 2000,
}
const DESIGN_PRICES: Record<CakeDesign, number> = {
  classic: 0,
  floral: 3000,
  birthday: 2000,
  minimal: 0,
}
const EXTRA_PRICES: Record<CakeExtra, number> = {
  candles: 1000,
  fruit: 2500,
  macarons: 4000,
}

export class DomainValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainValidationError'
  }
}

export class CakeBuilder {
  private size?: CakeSize
  private flavor?: CakeFlavor
  private frosting?: Frosting
  private design?: CakeDesign
  private color?: string
  private message = ''
  private extras: CakeExtra[] = []

  withSize(value: unknown): this {
    this.size = enumValue(value, SIZES, 'size')
    return this
  }

  withFlavor(value: unknown): this {
    this.flavor = enumValue(value, FLAVORS, 'flavor')
    return this
  }

  withFrosting(value: unknown): this {
    this.frosting = enumValue(value, FROSTINGS, 'frosting')
    return this
  }

  withDesign(value: unknown): this {
    this.design = enumValue(value, DESIGNS, 'design')
    return this
  }

  withColor(value: unknown): this {
    if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) {
      throw new DomainValidationError('color must be a six-digit hex color')
    }
    this.color = value.toUpperCase()
    return this
  }

  withMessage(value: unknown): this {
    if (typeof value !== 'string' || value.length > 80) {
      throw new DomainValidationError('message must be a string of at most 80 characters')
    }
    this.message = value.trim()
    return this
  }

  withExtras(value: unknown): this {
    if (!Array.isArray(value) || value.length > EXTRAS.length) {
      throw new DomainValidationError('extras must be an array with at most three items')
    }
    const extras = value.map((extra) => enumValue(extra, EXTRAS, 'extra'))
    if (new Set(extras).size !== extras.length) {
      throw new DomainValidationError('extras cannot contain duplicates')
    }
    this.extras = extras
    return this
  }

  build(): CakeConfiguration {
    if (!this.size || !this.flavor || !this.frosting || !this.design || !this.color) {
      throw new DomainValidationError('size, flavor, frosting, design and color are required')
    }
    return {
      size: this.size,
      flavor: this.flavor,
      frosting: this.frosting,
      design: this.design,
      color: this.color,
      message: this.message,
      extras: [...this.extras],
    }
  }
}

interface CakeCost {
  cost(): number
}

class BaseCake implements CakeCost {
  constructor(private readonly amount: number) {}
  cost(): number {
    return this.amount
  }
}

class ExtraDecorator implements CakeCost {
  constructor(
    private readonly cake: CakeCost,
    private readonly extra: CakeExtra,
  ) {}
  cost(): number {
    return this.cake.cost() + EXTRA_PRICES[this.extra]
  }
}

export function priceCake(cake: CakeConfiguration): CakePrice {
  let pricedCake: CakeCost = new BaseCake(
    BASE_PRICES[cake.size] +
      FLAVOR_PRICES[cake.flavor] +
      FROSTING_PRICES[cake.frosting] +
      DESIGN_PRICES[cake.design],
  )
  for (const extra of cake.extras) pricedCake = new ExtraDecorator(pricedCake, extra)
  return {
    description: 'Pastel personalizado',
    amount: pricedCake.cost(),
  }
}

function enumValue<const T extends readonly string[]>(value: unknown, values: T, field: string): T[number] {
  if (typeof value !== 'string' || !values.includes(value)) {
    throw new DomainValidationError(`invalid ${field}`)
  }
  return value as T[number]
}
