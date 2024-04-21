import translatte from "translatte";
import * as fs from "fs";
import path from "path";

export class Translate {
  /**
   *
   * @param {string} from
   * @param {string} to
   */
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  /**
   *
   * @param {object} obj
   */
  async #iterate(obj) {
    for (let property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (typeof obj[property] == "object") {
          await this.#iterate(obj[property]);
        } else {
          try {
            const t = await translatte(obj[property], { to: this.to });
            obj[property] = t.text;
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }

  /**
   *
   * @param {string} from
   * @param {string} to locale
   */
  async forI18n() {
    const translation = JSON.parse(
      fs.readFileSync(
        path.resolve("locales", this.from, "translation.json"),
        "utf8"
      )
    );

    await this.#iterate(translation);

    const dirPath = path.resolve("locales", this.to);

    fs.mkdirSync(dirPath, { recursive: true });

    fs.writeFileSync(
      path.resolve("locales", this.to, "translation.json"),
      JSON.stringify(translation, null, 2) + "\n"
    );
  }
}

const translate = new Translate("en", "sv");

translate.forI18n();
