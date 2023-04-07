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
		ssrc, payload := DecodePCM(packet)

		if payload == nil {
			continue
		}

		// TODO:
		// 检查序号，去除重复

		if _, ok := streamsMap[ssrc]; !ok {
			streamsMap[ssrc] = &RTPStream{
				ssrc: ssrc,
			}
		} else {

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
