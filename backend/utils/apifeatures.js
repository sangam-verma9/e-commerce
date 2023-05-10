class Apifeature {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }
  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};
    // console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const quarycopy = { ...this.querystr };
    //removing some field for category
    const removefield = ["keyword", "page", "limit"];
    removefield.forEach((key) => delete quarycopy[key]);

    //filter for price and rating
    let quertStr = JSON.stringify(quarycopy);
    quertStr = quertStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(quertStr));
    // this.query = this.query.find(quarycopy);
    // console.log(quarycopy);
    return this;
  }
  pagination(resultperpage) {
    const currpage = Number(this.querystr.page) || 1;
    const skip = resultperpage * (currpage - 1);
    this.query = this.query.limit(resultperpage).skip(skip);
    return this;
  }
}
module.exports = Apifeature;
