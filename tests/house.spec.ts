import { expect, test } from '@playwright/test'
const stage = (page: import('@playwright/test').Page) => page.locator('.world-scene[data-room]')
async function settled(page: import('@playwright/test').Page, room: string) {
  await expect(stage(page)).toHaveAttribute('data-room', room, { timeout: 15000 })
  await expect(page.locator('.game-screen')).toHaveAttribute('data-travelling', 'false', {
    timeout: 15000,
  })
  await expect(page.locator('.room-snapshot')).toHaveCount(0)
}
test('camina a una puerta y la cámara se desliza de casita a cocina y dormitorio', async ({
  page,
}) => {
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Ir a Cocina', exact: true }).click()
  await expect(stage(page)).toHaveAttribute('data-room', 'home')
  await expect(page.locator('.actor-active .original-character')).toHaveClass(/walking/)
  await expect(page.locator('.room-snapshot')).toHaveCount(1, { timeout: 6000 })
  await expect(page.locator('.game-viewport')).toHaveClass(/room-enter-right/)
  await settled(page, 'kitchen')
  await expect(page.getByRole('button', { name: 'Seleccionar Nevera', exact: true })).toBeVisible()
  expect(Number(await page.locator('.actor-active').getAttribute('data-x'))).toBeLessThan(35)
  await page.screenshot({ path: '/tmp/emiverse-kitchen-desktop.png' })
  await page.getByRole('button', { name: 'Ir a Dormitorio', exact: true }).click()
  await settled(page, 'bedroom')
  await expect(page.getByRole('button', { name: 'Seleccionar Cama', exact: true })).toBeVisible()
  await page.screenshot({ path: '/tmp/emiverse-bedroom-desktop.png' })
})
test('una ruta lejana visita las habitaciones intermedias y restaura la última al recargar', async ({
  page,
}) => {
  await page.goto('/emiverse/')
  const visited: string[] = []
  await page.exposeFunction('recordRoom', (room: string) => visited.push(room))
  await page.evaluate(() => {
    const scene = document.querySelector('.world-scene[data-room]')!
    new MutationObserver(() => {
      ;(window as unknown as { recordRoom: (room: string) => void }).recordRoom(
        scene.getAttribute('data-room')!,
      )
    }).observe(scene, { attributes: true, attributeFilter: ['data-room'] })
  })
  await page.getByRole('button', { name: 'Dormitorio', exact: true }).click()
  await settled(page, 'bedroom')
  expect(visited).toContain('kitchen')
  expect(visited).toContain('bedroom')
  await page.reload()
  await settled(page, 'bedroom')
  await page.getByRole('button', { name: 'Jardín', exact: true }).click()
  await settled(page, 'garden')
  await expect(
    page.getByRole('button', { name: 'Seleccionar Arcoflor', exact: true }),
  ).toBeVisible()
})
test('abrir un menú cancela el recorrido pendiente sin teletransportar al personaje', async ({
  page,
}) => {
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Dormitorio', exact: true }).click()
  await page.getByRole('button', { name: 'Cómo jugar', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await expect(page.locator('.game-screen')).toHaveAttribute('data-travelling', 'false')
  await expect(stage(page)).toHaveAttribute('data-room', 'home')
})
test.describe('recorrido táctil', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  test('cruza puertas con el dedo y puede salir al jardín arrastrando a Leo hasta la salida', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/emiverse/')
    await page.getByRole('button', { name: 'Ir a Cocina', exact: true }).tap()
    await settled(page, 'kitchen')
    await page.screenshot({ path: '/tmp/emiverse-kitchen-mobile.png' })
    await page.getByRole('button', { name: 'Ir a Casita', exact: true }).tap()
    await settled(page, 'home')
    await page.getByRole('button', { name: 'Jugar con Leo', exact: true }).tap()
    const actor = page.getByRole('button', { name: 'Seleccionar Leo', exact: true }),
      box = (await actor.boundingBox())!
    const cdp = await page.context().newCDPSession(page),
      x = box.x + box.width / 2,
      y = box.y + box.height / 2
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x - 80, y }],
    })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await settled(page, 'garden')
    await page.setViewportSize({ width: 844, height: 390 })
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= innerWidth &&
          document.documentElement.scrollHeight <= innerHeight,
      ),
    ).toBe(true)
    await expect(page.locator('.direction-pad')).toHaveCount(0)
    expect(errors).toEqual([])
  })
})
