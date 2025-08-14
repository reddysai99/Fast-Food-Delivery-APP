import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import {CreateUserParams, GetMenuParams, SignInParams} from "@/type";


export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.sai.fooddelivery",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId:"687a13a30031b367626b",
    bucketId:"68972566002f135dc8a1",
    UserCollectionId:"687a141900356d65297a",
    categoriesCollectionId: "68971547000874f2c3a8",
    menuCollectionId: "68971618001adad83a2c",
    customizationCollectionId: "689721e0000fa76ba08c",
    menuCustomizationCollectionId: "689723e9001cb4c4b978",
}

export const client = new Client();

client
.setEndpoint(appwriteConfig.endpoint)
.setProject(appwriteConfig.projectId)
.setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount =  await account.create(ID.unique(), email, password, name);

        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

         return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.UserCollectionId,
            ID.unique(),
            { accountId: newAccount.$id, email, name, avatar: avatarUrl }
        );
    } catch (e) {
        throw new Error(e as string)
    }
}
export const signIn = async ({ email, password }: SignInParams) => {
   try {
        const session = await account.createEmailPasswordSession(email, password);
   } catch (e) {
     throw new Error(e as string);
   }
}

export const getCurrentUser = async () => {
    try {
      const currentAccount = await account.get();
      if(!currentAccount) throw Error;

      const currentUser = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.UserCollectionId,
          [Query.equal('accountId', currentAccount.$id)]
      )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
         const queries: string[] = [];

         if(category) queries.push(Query.equal('categories', category));
         if(query) queries.push(Query.search('name', query));

         const menus =  await databases.listDocuments(
             appwriteConfig.databaseId,
             appwriteConfig.menuCollectionId,
             queries,
         )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
      const categories = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.categoriesCollectionId,
      )
    } catch (e) {
        throw new Error(e as string);
    }
}