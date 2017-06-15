const {Store} = require("wetland");

exports.seed = (wetland, entitiesFeatures) => {
  const manager   = wetland.getManager();
  const populator = wetland.getPopulator(manager);

  let tableQueries = [];

  Reflect.ownKeys(entitiesFeatures).forEach(entity => {
    let Entity           = manager.getEntity(entity);
    let entityRepository = manager.getRepository(Entity);
    let mapping          = entityRepository.mapping;

    let queries = [];

    entitiesFeatures[entity].forEach(entityFeature => {
      let populated    = populator.assign(Entity, entityFeature);
      let statement    = entityRepository.getConnection(Store.ROLE_MASTER)(`${mapping.getTableName()}`);
      let queryBuilder = entityRepository.getQueryBuilder(null, statement);
      queries.push(queryBuilder.insert(populated).getQuery().execute());
    });

    tableQueries.push(queries);
  });

  return Promise.all(tableQueries);
};
