module.exports = () => {
  const faker = require('faker')
  const data = { csrf: [], posts: [] }
  for (let i = 0; i < 100; i++) {
    data.posts.push({
      id: faker.lorem.slug(),
      title: faker.lorem.sentence(),
      teaser: faker.lorem.sentences(),
      text: faker.lorem.paragraphs(),
    })
  }
  return data
}
