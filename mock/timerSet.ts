import faker from 'faker'
import { Response, Request } from 'express'
import { ITimerData,ITimerItemData } from '../src/api/types'

const timerList: ITimerData[] = [
  {
    id: 0,
    name:faker.name.findName(),
    desc:faker.random.alphaNumeric(Math.random()*10)
  },
  {
    id: 1,
    name:faker.name.findName(),
    desc:faker.random.alphaNumeric(Math.random()*10)
  }
]
const timerCount = 30

for (let i = 2; i < timerCount; i++) {
  timerList.push({
    id: i,
    name: faker.name.findName(),
    desc: faker.random.alphaNumeric(Math.random()*10)
  })
}
export const getTimerList = (req: Request, res: Response) => {
  function cutArray(array:Array<any>, subLength:number) {
      let index = 0;
      let newArr = [];
      while(index < array.length) {
          newArr.push(array.slice(index, index += subLength));
      }
      return newArr;
  }
  const {page,pageSize} = req.body;
  let subArray= cutArray([...timerList].reverse(), pageSize||10);
  const data = subArray[page-1]||[];
  return res.json({
    code: 20000,
    data: data,
    total:timerList.length
  })
}
export const saveTimer = (req: Request, res: Response) => {
  const {name,desc} = req.body;
  let id = timerList[timerList.length-1].id;
  id++;
  timerList.push({
    id:id,
    name:name,
    desc:desc
  });
  return res.json({
    code: 20000,
    message: "新增成功"
  })
}
export const updateTimer = (req: Request, res: Response) => {
  const {name,desc,id} = req.body;
  for (const v of timerList) {
    if (v.id === id) {
      v.name = name;
      v.desc = desc;
      return res.json({
        code: 20000,
        data: "修改成功"
      })
    }
  }
  return res.json({
    code: 70001,
    message: '无此数据'
  })
}

export const delTimer = (req: Request, res: Response) => {
  const {id} = req.body;
  for (let index = 0; index < timerList.length; index++) {
    const element = timerList[index];
    if (element.id.toString() === id) {
      timerList.splice(index,1);
      return res.json({
        code: 20000,
        data: "删除成功"
      })
    }
  }
  return res.json({
    code: 20000
  });
}

const typeList = ['INT',"TINYINT","SMALLINT","FLOAT(M,D)","DATE","VARCHAR"];

const timerItemList: ITimerItemData[] = []
for (let i = 1; i < 6; i++) {
  timerItemList.push({
    id: i,
    type:typeList[Math.floor((Math.random()*typeList.length))],
    name: faker.random.alphaNumeric(Math.random()*10),
    desc: faker.name.findName()
  })
}

export const queryTypeList = (req: Request, res: Response) => {
  let arr = [];
  for (let index = 0; index < typeList.length; index++) {
    const element = typeList[index];
    arr.push({
      name:element,
      value:element
    })
  }
  return res.json({
    code: 20000,
    message: "查询成功",
    data:arr
  })
}

export const getTimerItemList = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: timerItemList
  })
}
export const saveItemTimer = (req: Request, res: Response) => {
  const {name,desc,type} = req.body;
  let id = timerItemList[timerItemList.length-1].id;
  id++;
  timerItemList.push({
    id:id,
    type:type,
    name:name,
    desc:desc
  });
  return res.json({
    code: 20000,
    message: "新增成功"
  })
}
export const updateItemTimer = (req: Request, res: Response) => {
  const {name,desc,id,type} = req.body;
  for (const v of timerItemList) {
    if (v.id === id) {
      v.name = name;
      v.desc = desc;
      v.type = type;
      return res.json({
        code: 20000,
        data: "修改成功"
      })
    }
  }
  return res.json({
    code: 70001,
    message: '无此数据'
  })
}

export const delTimerItem = (req: Request, res: Response) => {
  const {id} = req.body;
  for (let index = 0; index < timerItemList.length; index++) {
    const element = timerItemList[index];
    if (element.id === id) {
      timerItemList.splice(index,1);
      return res.json({
        code: 20000,
        data: "删除成功"
      })
    }
  }
  return res.json({
    code: 20000
  });
}
