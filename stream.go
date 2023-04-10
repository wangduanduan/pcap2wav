package pcap2wav

import (
	"fmt"
	"os"

	"github.com/google/gopacket"
)

var streamsMap = make(map[uint32]*RTPStream)

type RTPStream struct {
	ssrc    uint32
	Len     int
	LastSeq uint16
	Payload [][]byte
}

func (r *RTPStream) WriteWav() {
	fileName := fmt.Sprintf("%#x.wav", r.ssrc)

	file, err := os.OpenFile(fileName, os.O_CREATE|os.O_RDWR, 0755)
	CheckError(err)
	defer file.Close()

	wavHeader := &WaveHeader{}
	wavHeader.DemoIt(r.Len)
	wavHeader.InitBuf()
	wavHeader.Write(file)

	for _, v := range r.Payload {
		file.Write(v)
	}
}

func AddSource(packetSource *gopacket.PacketSource) {
	for packet := range packetSource.Packets() {
		wp := DecodePCM(packet)

		if wp == nil {
			continue
		}

		ssrc := wp.RTPPacket.SSRC
		payload := wp.PCM

		if payload == nil {
			continue
		}

		if v, ok := streamsMap[ssrc]; !ok {
			streamsMap[ssrc] = &RTPStream{
				ssrc:    ssrc,
				LastSeq: wp.RTPPacket.SequenceNumber,
			}
		} else if wp.RTPPacket.SequenceNumber <= v.LastSeq {
			// 出现重复的序号，跳过
			continue
		} else {
			// 更新序号
			v.LastSeq = wp.RTPPacket.SequenceNumber
		}

		streamsMap[ssrc].Payload = append(streamsMap[ssrc].Payload, payload)
		streamsMap[ssrc].Len += len(payload)
	}
}

func WriteWav() {
	for _, rtp := range streamsMap {
		rtp.WriteWav()
	}
}
