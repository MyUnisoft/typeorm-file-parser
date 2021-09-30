// Import Third-party Dependencies
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,

  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,

  PrimaryGeneratedColumn,
  Unique
} from "typeorm";

// Import ENUM
import { giAmount, giExercice, giTypeArticle, periodicity } from "../../enum";

// Import Related Entities
import { GiMission } from "./giMission";
import { GiVintage } from "./giVintage";
import { WorkUnit } from "./workUnit";
import { Vat } from "../../sch_global/vat/vat";

@Entity()
@Unique("GiArticle_reference", ["reference"])
export class GiArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50 })
  name: string;

  @Column("varchar", { length: 6 })
  reference: string;

  @Column("text", {
    nullable: true
  })
  note: string;

  @Column({ type: "enum", enum: giTypeArticle })
  type: giTypeArticle;

  @Column({ type: "enum", enum: periodicity })
  periodicity: periodicity;

  @Column("boolean")
  mandatoryArticle: boolean;

  // collector: string;

  // trigger: string;

  @Column("enum", { enum: giExercice })
  exercice: string;

  @Column("smallint")
  firstDeadline: number;

  @Column("varchar", { length: 6 })
  firmAccount: number;

  @Column("varchar", { length: 6 })
  firmCollectedVat: string;

  @Column("varchar", { length: 6 })
  clientAccount: string;

  @Column("varchar", { length: 6 })
  clientDeductibleVat: string;

  @Column("boolean", {
    default: false
  })
  billed: boolean;

  @Column("boolean", { default: false })
  archived: boolean;

  @Column("enum", { enum: giAmount })
  amount: giAmount;

  // FOREIGN KEY
  @ManyToMany(() => GiMission, (table) => table.articles)
  @JoinTable({ name: "gi_articles_missions" })
  // @JoinColumn({ name: "missionIds" })
  missions: GiMission[];

  @OneToOne(() => GiArticle, (table) => table.id)
  @JoinColumn({ name: "account_article_id" })
  accountArticle: GiArticle;

  @ManyToOne(() => WorkUnit, (table) => table.articles, { nullable: false, cascade: true })
  workUnit: WorkUnit;

  @ManyToOne(() => Vat, (table) => table.giArticlesFirm, { nullable: false })
  @JoinColumn({ name: "firm_vat_id" })
  firmVat: Vat;

  @ManyToOne(() => Vat, (table) => table.giArticlesClient, { nullable: false })
  @JoinColumn({ name: "client_vat_id" })
  clientVat: Vat;

  // RELATION
  @OneToMany(() => GiVintage, (table) => table.article, { cascade: true })
  vintages: GiVintage;
}

export interface IGiArticle {
  id?: number;
  name: string;
  reference: string;
  note?: string;
  type: giTypeArticle;
  periodicity?: periodicity;
  mandatoryArticle: boolean;
  exercice: string;
  firstDeadline: number;
  firmAccount: string;
  firmCollectedVat: string;
  firmVat: Vat;
  clientAccount: string;
  clientDeductibleVat: string;
  clientVat: Vat;
  billed: boolean;
  archived: boolean;
  amount: giAmount;
  missions?: GiMission[];
  AccountArticle: GiArticle;
  workUnit: WorkUnit;
  vintages?: GiVintage[];
}
