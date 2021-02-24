import { GraphQLInt, GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLBoolean, GraphQLList } from 'graphql';
import MBulkSolid from '../Models/MBulkSolid';



const BulkSolidType = new GraphQLObjectType({
  name: 'BulkSolid',
  fields: {
    bulkSolidID: {
      type: GraphQLInt,
    },
    aID: {
      type: GraphQLString,
    },
    arrivalDate: {
      type: GraphQLString,
    },
    bulkSolidShape: {
      type: GraphQLString,
    },
    casNumber: {
      type: GraphQLString,
    },
    density: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    enteredBy: {
      type: GraphQLString,
    },
    exprotection: {
      type: GraphQLBoolean,
    },
    msds: {
      type: GraphQLBoolean,
    },
    msdsFile: {
      type: GraphQLString,
    },
    note: {
      type: GraphQLString,
    },
    pictureFile: {
      type: GraphQLString,
    },
    onHold: {
      type: GraphQLBoolean,
    },
    storedAt: {
      type: new GraphQLList(GraphQLString),
    },
  }
})


const root = new GraphQLObjectType({
  name: 'rootquery',
  fields: {
    bulksolid: {
      type: BulkSolidType,
      async resolve(parent, args) {
        const doc = await MBulkSolid.findOne({})
        console.log(doc)
        return doc
      }
    }
  }
})

export default new GraphQLSchema({
  query: root
})

