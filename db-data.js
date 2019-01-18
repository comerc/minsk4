module.exports = () => {
  const faker = require('faker')
  const data = { posts: [] }
  for (let i = 0; i < 1000; i++) {
    data.posts.push({
      id: faker.lorem.slug(),
      title: faker.lorem.sentence(),
      teaser: faker.lorem.sentences(),
      text: faker.lorem.paragraphs(),
    })
  }
  return data
}
