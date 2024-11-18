let modifyTreeListData:any[] = [];
export const modifyTreeList = (data: any[]) => {
    modifyTreeListData = []
    _modifyTreeList(data)
    return modifyTreeListData
}
const _modifyTreeList = (data: any[]) => {
    if (data.length > 0) {
        data.forEach((item: any) => {
            modifyTreeListData.push({
                parentCode: item.parent_code || 'root',
                categoryCode: item.category_code,
                name: item.name,
                image: item.image,
                hasChildren: item.children?.length > 0,
                childrenCount: item.children?.length || 0,
            })
            if (item?.children?.length > 0) {
                _modifyTreeList(item.children)
            }
        })
    }
}