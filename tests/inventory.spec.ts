import { expect, test, type Locator, type Page } from '@playwright/test'
import { initialSave } from '../src/domain/world'

async function settled(page: Page, room: string) {
  await expect(page.locator('.world-scene[data-room]')).toHaveAttribute('data-room', room, {
    timeout: 20000,
  })
  await expect(page.locator('.game-screen')).toHaveAttribute('data-travelling', 'false', {
    timeout: 20000,
  })
}
async function touchDrag(page: Page, from: Locator, to: Locator, cancel = false) {
  await from.scrollIntoViewIfNeeded()
  const a = (await from.boundingBox())!,
    b = (await to.boundingBox())!,
    x = a.x + a.width / 2,
    y = a.y + a.height / 2
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: b.x + b.width * 0.7, y: b.y + b.height * 0.65 }],
  })
  await cdp.send('Input.dispatchTouchEvent', {
    type: cancel ? 'touchCancel' : 'touchEnd',
    touchPoints: [],
  })
  await cdp.detach()
}
test.describe('compras táctiles', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  test('recoger un producto dejado en el suelo no queda bloqueado por controles', async ({
    page,
  }) => {
    await page.addInitScript(
      (save) => localStorage.setItem('emiverse-world-v1', JSON.stringify(save)),
      {
        ...initialSave,
        currentRoom: 'bedroom',
        castPositions: { ...initialSave.castPositions, bedroom: { emily: { x: 22, y: 83 } } },
        inventory: [{ id: 'test-toy', kind: 'toy', place: 'bedroom', point: { x: 55, y: 86 } }],
      },
    )
    await page.goto('/emiverse/')
    const item = page.getByRole('button', { name: 'Seleccionar Osito de juguete', exact: true })
    await item.tap({ timeout: 3000 })
    await expect(item).toHaveCount(0)
  })
  test('caminar a la tienda, llenar la bolsa y guardar comida y juguetes en la nevera', async ({
    page,
  }) => {
    test.setTimeout(60000)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('/emiverse/')
    await page.getByRole('button', { name: 'Tienda', exact: true }).tap()
    await settled(page, 'shop')
    await expect(
      page.getByRole('group', { name: 'Productos de la tienda' }).getByRole('button'),
    ).toHaveCount(10)
    for (const name of ['Manzana', 'Leche', 'Osito de juguete'])
      await page.getByRole('button', { name: `Tomar ${name}`, exact: true }).tap()
    await page.screenshot({ path: '/tmp/emiverse-shop-mobile.png' })
    await expect(page.getByRole('button', { name: 'Abrir bolsa', exact: true })).toContainText('3')
    await page.getByRole('button', { name: 'Cocina', exact: true }).tap()
    await settled(page, 'kitchen')
    await page.getByRole('button', { name: 'Seleccionar Nevera', exact: true }).tap()
    const fridge = page.getByRole('region', { name: 'Interior de la nevera' }),
      bag = page.getByRole('region', { name: 'Contenido de la bolsa' })
    await touchDrag(
      page,
      bag.getByRole('button', { name: 'Seleccionar Manzana', exact: true }),
      fridge,
    )
    await expect(
      fridge.getByRole('button', { name: 'Seleccionar Manzana', exact: true }),
    ).toBeVisible()
    await bag.getByRole('button', { name: 'Seleccionar Osito de juguete', exact: true }).tap()
    await page.getByRole('button', { name: 'A la nevera', exact: true }).tap()
    await touchDrag(
      page,
      bag.getByRole('button', { name: 'Seleccionar Leche', exact: true }),
      fridge,
    )
    await expect(fridge.locator('[data-cargo-id]')).toHaveCount(3)
    await expect(bag.locator('[data-cargo-id]')).toHaveCount(0)
    await page.screenshot({ path: '/tmp/emiverse-fridge-mobile.png' })
    await page.getByRole('button', { name: 'Cerrar', exact: true }).tap()
    await page.reload()
    await page.getByRole('button', { name: 'Seleccionar Nevera', exact: true }).tap()
    await expect(fridge.locator('[data-cargo-id]')).toHaveCount(3)
    await touchDrag(
      page,
      fridge.getByRole('button', { name: 'Seleccionar Osito de juguete', exact: true }),
      bag,
    )
    await expect(
      bag.getByRole('button', { name: 'Seleccionar Osito de juguete', exact: true }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Cerrar', exact: true }).tap()
    await page.getByRole('button', { name: 'Dormitorio', exact: true }).tap()
    await settled(page, 'bedroom')
    await page.getByRole('button', { name: 'Abrir bolsa', exact: true }).tap()
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Seleccionar Osito de juguete', exact: true })
      .tap()
    await page.getByRole('button', { name: 'Dejar en Dormitorio', exact: true }).tap()
    await page.getByRole('button', { name: 'Cerrar', exact: true }).tap()
    const loose = page.getByRole('button', { name: 'Seleccionar Osito de juguete', exact: true })
    await expect(loose).toBeVisible()
    await page.reload()
    await expect(loose).toBeVisible()
    await loose.tap()
    await expect(loose).toHaveCount(0)
    expect(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem('emiverse-world-v1')!).inventory.length,
      ),
    ).toBe(3)
    expect(errors).toEqual([])
  })
  test('también puede guardar un objeto original de la casa sin duplicarlo', async ({ page }) => {
    await page.goto('/emiverse/')
    await page.getByRole('button', { name: 'Mover objetos', exact: true }).tap()
    await page.getByRole('button', { name: 'Seleccionar Nubi', exact: true }).tap()
    await page.getByRole('button', { name: 'Llevar en bolsa', exact: true }).tap()
    await expect(page.locator('[data-item="pet"]')).toHaveCount(0)
    await page.getByRole('button', { name: 'Mover objetos', exact: true }).tap()
    await page.getByRole('button', { name: 'Cocina', exact: true }).tap()
    await settled(page, 'kitchen')
    await page.getByRole('button', { name: 'Seleccionar Nevera', exact: true }).tap()
    await page.getByRole('button', { name: 'Seleccionar Nubi', exact: true }).tap()
    await page.getByRole('button', { name: 'A la nevera', exact: true }).tap()
    await expect(
      page
        .getByRole('region', { name: 'Interior de la nevera' })
        .getByRole('button', { name: 'Seleccionar Nubi', exact: true }),
    ).toBeVisible()
    await page.reload()
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('emiverse-world-v1')!))
    expect(saved.inventory).toEqual([{ id: 'world-pet', kind: 'pet', place: 'fridge' }])
    expect(saved.characters).toHaveLength(1)
    expect(saved.closetSlots.filter(Boolean)).toHaveLength(5)
    await page.getByRole('button', { name: 'Casita', exact: true }).tap()
    await settled(page, 'home')
    await page.getByRole('button', { name: 'Abrir mapa de aventuras', exact: true }).tap()
    const mapItem = page.getByRole('dialog').getByRole('button', { name: /Nubi/ })
    await expect(mapItem).toContainText('En la nevera')
    await mapItem.tap()
    await expect(page.getByRole('dialog', { name: 'Mi nevera' })).toBeVisible({ timeout: 10000 })
    await expect(
      page
        .getByRole('region', { name: 'Interior de la nevera' })
        .getByRole('button', { name: 'Seleccionar Nubi', exact: true }),
    ).toBeVisible()
  })
  test('cancelar un gesto de inventario conserva el objeto en su contenedor', async ({ page }) => {
    await page.addInitScript(
      (save) => localStorage.setItem('emiverse-world-v1', JSON.stringify(save)),
      {
        ...initialSave,
        currentRoom: 'kitchen',
        inventory: [{ id: 'apple-1', kind: 'apple', place: 'bag' }],
      },
    )
    await page.goto('/emiverse/')
    await page.getByRole('button', { name: 'Seleccionar Nevera', exact: true }).tap()
    const fridge = page.getByRole('region', { name: 'Interior de la nevera' }),
      bag = page.getByRole('region', { name: 'Contenido de la bolsa' })
    await touchDrag(
      page,
      bag.getByRole('button', { name: 'Seleccionar Manzana', exact: true }),
      fridge,
      true,
    )
    await expect(bag.locator('[data-cargo-id]')).toHaveCount(1)
    await expect(fridge.locator('[data-cargo-id]')).toHaveCount(0)
    expect(
      await page.evaluate(() => JSON.parse(localStorage.getItem('emiverse-world-v1')!).inventory),
    ).toEqual([{ id: 'apple-1', kind: 'apple', place: 'bag' }])
  })
  test('se puede recorrer una bolsa llena desde el celular', async ({ page }) => {
    await page.addInitScript(
      (save) => localStorage.setItem('emiverse-world-v1', JSON.stringify(save)),
      {
        ...initialSave,
        currentRoom: 'kitchen',
        inventory: Array.from({ length: 12 }, (_, i) => ({
          id: `milk-${i}`,
          kind: 'milk',
          place: 'bag',
        })),
      },
    )
    await page.goto('/emiverse/')
    await page.getByRole('button', { name: 'Seleccionar Nevera', exact: true }).tap()
    await page
      .getByRole('button', { name: 'Ver siguientes objetos de la bolsa', exact: true })
      .tap()
    await expect
      .poll(() => page.locator('.storage-bag-items').evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(100)
    await expect(
      page.getByRole('region', { name: 'Contenido de la bolsa' }).locator('[data-cargo-id]'),
    ).toHaveCount(12)
  })
})
for (const [name, width, height] of [
  ['tablet', 820, 1180],
  ['desktop', 1440, 900],
  ['landscape', 844, 390],
] as const) {
  test(`la tienda y la nevera caben en ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.addInitScript(
      (save) => localStorage.setItem('emiverse-world-v1', JSON.stringify(save)),
      { ...initialSave, currentRoom: 'shop' },
    )
    await page.goto('/emiverse/')
    await expect(page.getByRole('button', { name: 'Tomar Leche', exact: true })).toBeInViewport()
    await page.screenshot({ path: `/tmp/emiverse-shop-${name}.png` })
    await page.getByRole('button', { name: 'Tomar Leche', exact: true }).click()
    await page.getByRole('button', { name: 'Abrir bolsa', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Seleccionar Leche', exact: true })).toBeVisible()
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollHeight <= innerHeight &&
          document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  })
}
