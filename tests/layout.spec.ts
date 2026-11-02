import { expect, test } from '@playwright/test'
async function drag(
  page: import('@playwright/test').Page,
  item: import('@playwright/test').Locator,
  dx: number,
  dy: number,
) {
  const box = (await item.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + dx, box.y + box.height / 2 + dy, { steps: 10 })
  await page.mouse.up()
}
test('mover objetos y muebles solo en modo Mover; tocar activa directamente', async ({ page }) => {
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Mover objetos', exact: true }).click()
  const pet = page.getByRole('button', { name: 'Seleccionar Nubi', exact: true })
  const initialX = Number(await pet.getAttribute('data-x'))
  const playerX = await page.locator('.actor-active').getAttribute('data-x')
  await pet.click()
  await expect(pet).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await drag(page, pet, -170, 35)
  const movedX = Number(await pet.getAttribute('data-x'))
  expect(movedX).toBeLessThan(initialX - 5)
  await expect(page.locator('.actor-active')).toHaveAttribute('data-x', playerX!)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.reload()
  await expect(pet).toHaveAttribute('data-x', movedX.toFixed(2))
  await pet.click()
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('emiverse-world-v1')!).fed),
  ).toBe(true)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: 'Mover objetos', exact: true }).click()
  const sofa = page.getByRole('button', { name: 'Seleccionar Sofá', exact: true })
  const sofaX = Number(await sofa.getAttribute('data-x'))
  await drag(page, sofa, 120, 50)
  expect(Number(await sofa.getAttribute('data-x'))).toBeGreaterThan(sofaX + 5)
  const placed = await sofa.getAttribute('data-x')
  await page.reload()
  await expect(sofa).toHaveAttribute('data-x', placed!)
  await expect(page.getByRole('button', { name: 'Volver a su lugar', exact: true })).toHaveCount(0)
})
test('cancelar el gesto no guarda la posición provisional y las flechas mueven el objeto enfocado', async ({
  page,
}) => {
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Mover objetos', exact: true }).click()
  const item = page.getByRole('button', { name: 'Seleccionar Sorpresa', exact: true })
  const before = await item.getAttribute('data-x')
  const box = (await item.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x - 100, box.y + 30, { steps: 5 })
  await expect(item).toHaveClass(/object-dragging/)
  await item.dispatchEvent('pointercancel')
  await page.mouse.up()
  await expect(item).not.toHaveClass(/object-dragging/)
  await expect(item).toHaveAttribute('data-x', before!)
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('emiverse-world-v1')!).objectPositions.gift,
    ),
  ).toBeUndefined()
  await item.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('ArrowLeft')
  expect(Number(await item.getAttribute('data-x'))).toBeLessThan(Number(before))
})
test('el personaje camina por todo el suelo sin subir por la pared', async ({ page }) => {
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Mover objetos', exact: true }).click()
  await page.getByRole('button', { name: 'Cerrar pista' }).click()
  await page.keyboard.down('ArrowUp')
  await expect
    .poll(async () => Number(await page.locator('.actor-active').getAttribute('data-y')), {
      timeout: 5000,
    })
    .toBeCloseTo(51, 1)
  await page.keyboard.up('ArrowUp')
  await page.keyboard.down('ArrowDown')
  await expect
    .poll(async () => Number(await page.locator('.actor-active').getAttribute('data-y')), {
      timeout: 5000,
    })
    .toBeGreaterThan(90)
  await page.keyboard.up('ArrowDown')
  expect((await page.locator('.actor-active').boundingBox())!.y).toBeGreaterThanOrEqual(0)
})
test.describe('entrada táctil', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  test('arrastrar con el dedo y ordenar el armario sin perder ropa', async ({ page }) => {
    await page.goto('/emiverse/')
    await page.getByRole('button', { name: 'Mover objetos', exact: true }).click()
    const cdp = await page.context().newCDPSession(page)
    const pet = page.getByRole('button', { name: 'Seleccionar Nubi', exact: true })
    await pet.tap()
    await expect(pet).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    const box = (await pet.boundingBox())!
    const x = box.x + box.width / 2,
      y = box.y + box.height / 2
    const before = Number(await pet.getAttribute('data-x'))
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x - 60, y: y + 20 }],
    })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect.poll(async () => Number(await pet.getAttribute('data-x'))).toBeLessThan(before - 5)
    await page.getByRole('button', { name: 'Mover objetos', exact: true }).tap()
    await page.getByRole('button', { name: 'Abrir mapa de aventuras' }).tap()
    await page.getByRole('button', { name: 'Armario', exact: true }).tap()
    const source = page.getByRole('button', { name: 'Espacio 1: Camiseta rosa', exact: true })
    const target = page.getByRole('button', { name: 'Espacio 6: vacío', exact: true })
    const a = (await source.boundingBox())!,
      b = (await target.boundingBox())!
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: a.x + a.width / 2, y: a.y + a.height / 2 }],
    })
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: b.x + b.width / 2, y: b.y + b.height / 2 }],
    })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(
      page.getByRole('button', { name: 'Espacio 6: Camiseta rosa', exact: true }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Espacio 1: vacío', exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Espacio 2: Camiseta menta', exact: true }).tap()
    await page.getByRole('button', { name: 'Poner a Emily', exact: true }).tap()
    await page.screenshot({ path: '/tmp/emiverse-organized-wardrobe.png' })
    await page.getByRole('button', { name: 'Cerrar', exact: true }).tap()
    await page.reload()
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('emiverse-world-v1')!))
    expect(saved.closetSlots[5]).toBe('rose')
    expect(saved.characters[0].shirt).toBe('#78bfad')
    expect(saved.objectPositions.pet).toBeDefined()
  })
})
test('girar el dispositivo durante un arrastre descarta solo el cambio provisional', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Mover objetos', exact: true }).click()
  const pet = page.getByRole('button', { name: 'Seleccionar Nubi', exact: true })
  const box = (await pet.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x - 70, box.y + 35, { steps: 5 })
  await expect(pet).toHaveClass(/object-dragging/)
  await page.setViewportSize({ width: 844, height: 390 })
  await expect(pet).not.toHaveClass(/object-dragging/)
  await page.mouse.up()
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('emiverse-world-v1')!).objectPositions.pet,
    ),
  ).toBeUndefined()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
