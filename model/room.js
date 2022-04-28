import prisma from '../lib/prisma';
import {objToJSON} from '../lib/utils';

export const RoomModel = {};

RoomModel.getAll = async () => {
    const rooms = await prisma.room.findMany({});
    return objToJSON(rooms);
};

RoomModel.getById = async id => {
    const room = await prisma.room.findUnique({
        where: {
            id: id,
        },
    });
    return objToJSON(room);
};
RoomModel.getByUuid = async uuid => {
    const room = await prisma.room.findUnique({
        where: {
            uuid: uuid,
        },
    });
    return objToJSON(room);
};

RoomModel.create = async item => {
    const room = await prisma.room.create({
        data: item,
    });
    return objToJSON(room);
};
