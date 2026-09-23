import { expect, test, type Page } from '@playwright/test'

async function noOverflow(page: Page, width: number) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(width)
}

test('pesquisa, detalhe, cadastro e edição de cliente', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Clientes' })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Clientes', exact: true }),
  ).toBeVisible()
  await page.getByRole('textbox', { name: 'Pesquisar clientes' }).fill('cafe')
  await expect(page.getByRole('link', { name: /Café Aurora/ })).toBeVisible()
  await expect(
    page.getByRole('link', { name: /Marina Albuquerque/ }),
  ).toHaveCount(0)
  await page.getByRole('link', { name: /Café Aurora/ }).click()
  await expect(page.getByRole('heading', { name: 'Café Aurora' })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Ordens relacionadas' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Editar cliente' }).click()
  await page.getByRole('textbox', { name: /Nome/ }).fill('Café Aurora Centro')
  await page.getByRole('button', { name: 'Salvar alterações' }).click()
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Visão geral' })
    .click()
  await expect(page.getByText('Café Aurora Centro').first()).toBeVisible()
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Clientes' })
    .click()
  await page.getByRole('link', { name: /Café Aurora Centro/ }).click()
  await page.getByRole('link', { name: 'Voltar para clientes' }).click()
  await page.getByRole('link', { name: 'Novo cliente' }).click()
  await page.getByRole('button', { name: 'Cadastrar cliente' }).click()
  await expect(page.getByRole('alert')).toContainText('Informe um nome')
  await page.getByRole('textbox', { name: /Nome/ }).fill('Papelaria Central')
  await page.getByRole('textbox', { name: /E-mail/ }).fill('invalido')
  await page.getByRole('button', { name: 'Cadastrar cliente' }).click()
  await expect(page.getByRole('alert')).toContainText(
    'Informe um e-mail válido',
  )
  await page
    .getByRole('textbox', { name: /E-mail/ })
    .fill('contato@papelaria.example')
  await page.getByRole('button', { name: 'Cadastrar cliente' }).click()
  await expect(page.getByRole('status')).toHaveText(
    'Cliente cadastrado com sucesso.',
  )
  await expect(
    page.getByRole('heading', { name: 'Papelaria Central' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Editar cliente' }).click()
  await page
    .getByRole('textbox', { name: /Nome/ })
    .fill('Papelaria Central Norte')
  await page.getByRole('button', { name: 'Salvar alterações' }).click()
  await expect(page.getByRole('status')).toHaveText(
    'Cliente atualizado com sucesso.',
  )
  await expect(
    page.getByRole('heading', { name: 'Papelaria Central Norte' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Voltar para clientes' }).click()
  await expect(
    page.getByRole('link', { name: /Papelaria Central Norte/ }),
  ).toBeVisible()
  await page.screenshot({
    path: 'test-results/customers-desktop.png',
    fullPage: true,
  })
  expect(errors).toEqual([])
})

for (const width of [360, 390]) {
  test(`fluxo essencial de clientes em ${width}px`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height: 780 })
    await page.goto('/')
    await page
      .getByRole('navigation', { name: 'Navegação mobile' })
      .getByRole('link', { name: 'Clientes' })
      .click()
    await expect(
      page.getByRole('heading', { name: 'Clientes', exact: true }),
    ).toBeVisible()
    await noOverflow(page, width)
    await page
      .getByRole('textbox', { name: 'Pesquisar clientes' })
      .fill('Marina')
    await page.getByRole('link', { name: /Marina Albuquerque/ }).click()
    await expect(
      page.getByRole('heading', { name: 'Marina Albuquerque' }),
    ).toBeVisible()
    await noOverflow(page, width)
    await page.getByRole('link', { name: 'Voltar para clientes' }).click()
    await page.getByRole('link', { name: 'Novo cliente' }).click()
    await noOverflow(page, width)
    await page.getByRole('textbox', { name: /Nome/ }).fill('Escola Horizonte')
    await page.getByRole('button', { name: 'Cadastrar cliente' }).click()
    await expect(
      page.getByRole('heading', { name: 'Escola Horizonte' }),
    ).toBeVisible()
    await page.getByRole('link', { name: 'Editar cliente' }).click()
    await page
      .getByRole('textbox', { name: /Nome/ })
      .fill('Escola Horizonte Sul')
    await page.getByRole('button', { name: 'Salvar alterações' }).click()
    await expect(
      page.getByRole('heading', { name: 'Escola Horizonte Sul' }),
    ).toBeVisible()
    await noOverflow(page, width)
    await page.screenshot({
      path: `test-results/customer-mobile-${width}.png`,
      fullPage: true,
    })
    expect(errors).toEqual([])
  })
}
