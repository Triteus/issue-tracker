
import UserModel, { IUserDocument, ERole } from '../models/user.model';


const visitorData: Partial<IUserDocument> = {
  email: 'randomvisitor@mail.com',
  firstName: 'random',
  lastName: 'visitor',
  password: 'visitor',
  roles: [ERole.Visitor]
}


export async function createVisitorIfNotExists() {
    const user = await UserModel.findOne({email: 'randomvisitor@mail.com'});
    if(!user) {
        console.log('creating visitor...');
      const visitor = new UserModel(visitorData);
      await visitor.save();
    }
  }