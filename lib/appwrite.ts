import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import {CreateUserParams, GetMenuParams, SignInParams, Category, MenuItem} from "@/type";


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

export const getMenu = async ({ category, query }: GetMenuParams): Promise<MenuItem[]> => {
    try {
         const queries: string[] = [];

         if(category) queries.push(Query.equal('categories', category));
         if(query) queries.push(Query.search('name', query));

         const menus =  await databases.listDocuments(
             appwriteConfig.databaseId,
             appwriteConfig.menuCollectionId,
             queries,
         )

        return menus.documents as MenuItem[];
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async (): Promise<Category[]> => {
    try {
      const categories = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.categoriesCollectionId,
      )
        return categories.documents as Category[];
    } catch (e) {
        throw new Error(e as string);
    }
}

export const logout = async () => {
    try {
        await account.deleteSession('current');
    } catch (e) {
        throw new Error(e as string);
    }
}

export const updateUserProfile = async (
    {
        documentId,
        name,
        mobile,
        avatar,
        address,
    }: { documentId: string; name?: string; mobile?: number; avatar?: string; address?: string }
) => {
    try {
        const payload: Record<string, any> = {};
        if (typeof name !== 'undefined') payload.name = name;
        if (typeof mobile !== 'undefined') payload.mobile = mobile;
        if (typeof avatar !== 'undefined') payload.avatar = avatar;
        if (typeof address !== 'undefined') payload.address = address;

        return await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.UserCollectionId,
            documentId,
            payload
        );
    } catch (e) {
        throw new Error(e as string);
    }
}

// Upload an image from a local file URI to Appwrite Storage and return a public view URL
export const uploadImageFromUri = async (uri: string, filename?: string): Promise<{ fileId: string; url: string }> => {
    try {
        const created = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            {
                uri,
                name: filename || `avatar-${Date.now()}.jpg`,
                type: 'image/jpeg',
            } as any
        );
        const fileId = created.$id;
        const url = storage.getFileView(appwriteConfig.bucketId, fileId).toString();
        return { fileId, url };
    } catch (e) {
        throw new Error(e as string);
    }
}