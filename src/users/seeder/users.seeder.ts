import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";
import { User } from "../entities/user.entity";
import * as bcrypt from "bcrypt";

@Seeder({
  model: User,
  unique: ["username"]
})
export class SeedUser implements OnSeederInit {
  run() {
    
    const data = [
      {
        username: "didik27",
        password: bcrypt.hashSync("didik123", 10),
        name: "Didik Nur Hidayat",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    return data;
  }
}