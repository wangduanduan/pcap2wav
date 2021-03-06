// tslint:disable:max-line-length

import * as path from 'path';
import * as os from 'os';
import { expect } from 'chai';
import { tshark } from './';

describe('tshark', () => {
    const pcap = path.resolve(__dirname, '../../samples/aaa.pcap');
    it('rtpInfo', async () => {
        const result = await tshark.rtpInfo({ pcap });
        const due = {
            info: [
                {
                    srcIp: '192.168.1.2',
                    srcPort: '30000',
                    dstIp: '212.242.33.36',
                    dstPort: '40392',
                    ssrc: '0x3796CB71',
                    codec: 'PCMA',
                    packets: '9',
                    lostPackets: '0',
                    lostPercent: '(0.0%)',
                    maxDelta: '69.95',
                    maxJitter: '7.80',
                    meanJitter: '18.02',
                    problems: undefined,
                },
            ],
        };
        expect(true).equal(result.success);
        expect(due.info).deep.equal(result.info);
        // expect('').equal(result.stderr);
    });

    it('extractPayload', async () => {
        const ssrc = '0x3796cb71';
        const dstIp = '212.242.33.36';
        const dstPort = '40392';
        const result = await tshark.extractPayload({ pcap, ssrc, dstIp, dstPort });
        const due = [
            'd5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:d5:11:04:1c:18:18:12:12:1e:10:14:17:6a:13:1c:18:04:04:05:06:01:01:00:07:05:05:19:13:05:1b:19:10:13:19:05:04:04:07:03:02:03:03:00:00:02:0d:0d:0d:00:01:03:0d:0c:0d:00:00:01:02:03:01:06:06:01:0f:0e:0e:0c:03:00:07:06:00:03:03:06:07:01:04:06:06:1b:1f:1c:11:69:60:62:15:11:10:14:6a:13:15:60:69:61:7d:74:52:5b:59:d7:47:5c:56:52:55:44:4b:42:75:59:73:78:5a:7c:6e:68:14:6a',
            '6e:68:15:14:6a:14:14:15:69:60:6e:6a:6c:6e:64:6c:6a:16:17:6c:6e:6d:60:66:7e:7f:45:c6:c9:f0:fc:e7:f3:fa:e5:f0:cb:f1:f6:cf:cd:e4:fa:c2:53:74:5f:42:5b:f6:f0:f2:fc:e0:ee:97:e8:f2:57:5a:4f:4d:75:67:7f:7d:66:65:74:75:43:78:4b:47:55:43:67:66:6d:63:6c:64:66:64:78:64:6f:6f:14:14:6c:17:11:13:10:17:10:1c:1f:1d:10:10:16:10:10:1f:1c:1f:19:1e:18:10:17:12:14:6c:62:6d:63:6a:15:15:17:6e:65:77:72:40:d0:f7:73:7d:7e:62:67:62:6a:15:6a:17:15:65:43:71:5a:59:7e:60:66:7a:72:72:49:65:7a:60:78:5d:44:42',
            '71:7e:70:76:d6:c5:d0:4b:74:76:7f:76:4f:50:41:d1:58:66:67:65:7f:67:6f:78:63:66:66:6a:14:17:16:14:11:10:10:15:6f:66:4f:7a:65:65:61:62:68:60:4f:7f:61:66:64:72:75:78:6d:6c:15:15:15:6a:67:6c:69:62:7f:78:66:60:67:63:61:74:cd:f8:d7:76:63:62:61:78:6f:78:72:60:69:6e:63:50:59:70:65:6d:64:61:67:65:6a:6a:11:12:10:10:13:1e:1f:1f:1d:17:6a:14:6f:46:5d:45:dd:5e:44:49:d6:d0:c4:51:51:df:d4:df:41:74:7f:67:d2:f5:e5:e6:ec:e8:97:96:ef:e0:ec:94:93:94:ea:ea:94:9f:90:9c:9c:92:97:f8:e7:ec:e7:e1:e0:ea',
            '92:97:e8:e9:97:ea:e5:fa:e7:e6:ec:fa:fa:c0:78:7a:61:64:70:60:67:78:cb:ef:ef:ea:ec:95:91:ee:e4:e2:ea:92:92:9d:92:90:94:95:91:9c:9e:9b:87:87:81:80:82:83:83:81:81:86:86:81:81:80:81:83:83:81:80:86:84:85:85:9e:99:85:84:85:85:87:87:86:85:85:84:80:82:80:83:81:98:9c:90:9d:9f:98:9f:90:96:ea:ee:ec:e9:ee:e8:97:e8:e2:ee:fa:dc:5a:dc:c9:f3:f2:f3:f6:e8:ea:ee:ee:97:91:96:96:91:9d:98:9b:98:85:87:86:86:85:9c:9e:99:9e:9f:99:9f:9f:93:93:9f:85:87:84:93:94:93:93:97:94:e9:f8:f7:4f:58:43:54:cf:41:42',
            '44:7d:70:56:de:f5:f6:f2:e0:ee:e1:f1:c3:78:78:64:64:61:7c:4f:54:59:5f:d1:cf:e0:ed:e7:f3:e4:94:93:94:94:95:ed:e2:ec:f1:f8:f8:e6:e4:f3:c7:cd:fd:fc:fd:fa:f4:e7:ed:e2:92:ea:e3:e1:ec:e7:e3:e1:fa:ff:de:c0:c0:42:7c:4b:d0:cd:f5:57:75:5d:dc:c9:f1:e0:e9:e9:e5:f0:cd:c5:d6:45:42:67:64:78:67:61:7f:7a:68:72:d6:fa:e6:e8:e9:e1:e0:e7:f0:c6:fc:c3:51:70:4d:c1:fa:e6:cd:cb:e5:ee:ec:e6:ed:ef:ea:97:ea:ee:e8:cb:d7:f0:de:f2:d3:dc:dd:56:d7:d5:f8:f4:f0:41:7f:7f:63:66:78:66:6c:11:1d:11:6a:6a:6f:60:70:78',
            '65:65:66:14:1d:1c:05:04:07:07:04:1b:1f:16:60:63:6d:62:14:6a:68:15:17:6f:17:13:16:10:10:1d:16:11:10:16:17:11:10:15:68:6a:6d:61:6e:63:63:14:16:10:1f:1e:12:1d:16:16:12:1d:17:69:6d:15:69:64:7f:68:6a:14:17:69:62:68:11:14:16:6f:66:66:6d:61:6d:68:15:11:1d:19:1c:1d:1f:1d:1b:1b:1e:1c:1d:1f:18:1b:19:11:15:6e:6a:14:12:1b:05:04:18:05:1b:1d:13:16:6c:7a:71:46:71:65:66:68:69:72:76:72:6a:13:13:11:12:13:14:6a:64:53:cb:c9:f1:f8:ed:fa:e3:fa:cb:cf:d4:f4:fa:5f:4f:d1:5b:4b:7f:49:75:54:cb:fe:e6:ec',
            'e4:d9:de:4b:49:7c:63:69:15:62:6f:68:15:6f:6d:6d:6d:63:65:64:72:73:78:6f:66:6a:68:68:6a:63:68:7a:73:4d:74:67:7a:7e:59:da:5d:45:cd:d1:d4:d1:db:d9:cb:ec:f1:dc:fc:e6:ee:97:95:95:97:97:ee:e9:e3:c3:f3:f4:f7:f5:f3:e1:fc:f3:f5:cd:c2:f6:e5:e5:fa:f3:f6:5a:49:74:68:6d:66:67:4b:70:47:54:d0:59:4d:4f:7e:5a:c1:cb:f3:c1:47:70:64:67:66:6c:64:73:7a:61:64:72:78:75:c7:e3:ff:f1:f1:4d:56:fc:d6:f5:e5:ec:ef:ee:95:91:90:9d:85:99:9b:9b:85:85:84:85:98:99:9b:84:85:84:84:98:9e:85:9b:84:84:9b:9c:96:97:97',
            'ea:ea:ec:e6:e7:94:90:93:97:95:91:96:94:ec:95:94:e0:f8:e8:ee:e1:cd:75:db:c6:c7:f3:fc:e2:e0:e6:e7:da:c0:f1:f8:c2:4d:cd:f0:e6:ee:ef:e3:ef:ea:e9:e4:e1:f8:ff:db:d8:d9:d7:fe:e5:e3:e1:ed:ec:93:97:94:ea:ec:e2:f3:cf:51:f5:50:cf:de:c9:e5:f2:e3:97:91:97:92:9c:91:97:e8:ea:93:96:90:95:ea:e8:e2:e2:e1:ef:ea:ec:94:97:e9:ea:e3:fe:f6:f6:cb:f8:e2:e0:e6:f8:fd:f7:f2:cb:f6:e6:f8:fa:e4:ec:e9:94:95:94:95:e9:e8:e8:ef:ed:ea:96:91:93:93:9c:93:91:92:90:93:93:91:97:96:96:91:90:90:96:e9:ea:e9:ec:95:97:97',
            '96:90:e9:96:9d:9c:99:9e:9f:92:96:91:95:ed:e7:f4:f4:f2:fc:fc:95:91:92:9e:84:87:84:98:91:91:97:9d:90:94:96:97:e8:e3:94:e8:96:91:96:9d:9c:9f:85:84:85:9d:91:90:97:95:e9:96:90:9d:9e:84:84:9b:85:87:85:85:99:85:98:93:9f:9d:92:90:90:ea:ef:ea:91:9d:9f:99:84:98:9d:9e:91:93:93:94:ec:e0:fa:f8:f6:e1:e0:f4:e5:f8:e4:e8:ea:e9:e5:f5:e5:e2:ed:fe:dc:d5:54:ff:fa:e8:97:e8:94:94:90:90:95:ee:e5:e6:fc:e6:ee:ee:95:96:91:97:96:ec:e3:e9:93:93:9f:9b:9f:98:93:95:95:ee:e9:ed:94:97:92:92:97:95:ef:ea:96:90',
            '',
        ].join(os.EOL);
        expect(due).equal(result);
    });

    it('rtpInfo GSM', async () => {
        const gsm = path.resolve(__dirname, '../../samples/sip-rtp-gsm.pcap');
        const result = await tshark.rtpInfo({ pcap: gsm });
        const due = {
            info: [
                {
                    srcIp: '10.0.2.15',
                    srcPort: '18924',
                    dstIp: '10.0.2.20',
                    dstPort: '6000',
                    ssrc: '0x043DAAF1',
                    codec: 'GSM',
                    packets: '425',
                    lostPackets: '0',
                    lostPercent: '(0.0%)',
                    maxDelta: '21.72',
                    maxJitter: '0.21',
                    meanJitter: '0.02',
                    problems: undefined,
                },
            ],
        };
        expect(true).equal(result.success);
        expect(due.info).deep.equal(result.info);
        // expect('').equal(result.stderr);
    });

    it('rtp start', async () => {
        const result = await tshark.rtpInfo({ pcap });
        expect(1120470985000).equal(result.rtpStart);
    });
});
