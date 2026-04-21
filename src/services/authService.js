const USERS = [
  {
    id: 1,
    nombre: 'Camila Molina',
    email: 'camila@skater.com',
    password: 'skate',
    preferencias: { unidad: 'C' },
    favoritos: ['Santiago', 'Valdivia', 'Coronel']
  },
  {
    id: 2,
    nombre: 'Andrea Molina',
    email: 'andrea@skater.com',
    password: 'Ollie',
    preferencias: { unidad: 'C' },
    favoritos: ['Santiago', 'Valparaíso']
  }
]

export function loginMock(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USERS.find(u => u.email === email && u.password === password)
      if (user) {
        const { password: _, ...safeUser } = user
        resolve(safeUser)
      } else {
        reject(new Error('Usuario o contraseña incorrectos'))
      }
    }, 600)
  })
}

export function registerMock(nombre, email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = USERS.find(u => u.email === email)
      if (exists) {
        reject(new Error('El email ya está registrado'))
        return
      }
      const newUser = {
        id: USERS.length + 1,
        nombre, email, password,
        preferencias: { unidad: 'C' },
        favoritos: []
      }
      USERS.push(newUser)
      const { password: _, ...safeUser } = newUser
      resolve(safeUser)
    }, 600)
  })
}
