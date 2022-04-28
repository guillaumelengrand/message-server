import prisma from '../lib/prisma';
import {objToJSON} from '../lib/utils';

export const ChannelModel = {};

ChannelModel.getAll = async () => {
    const channels = await prisma.channel.findMany({});
    return objToJSON(channels);
};

ChannelModel.getById = async id => {
    const channel = await prisma.channel.findUnique({
        where: {
            id: id,
        },
    });
    return objToJSON(channel);
};
ChannelModel.getByUuid = async uuid => {
    const channel = await prisma.channel.findUnique({
        where: {
            uuid: uuid,
        },
    });
    return objToJSON(channel);
};

ChannelModel.create = async item => {
    const channel = await prisma.channel.create({
        data: item,
    });
    return objToJSON(channel);
};
