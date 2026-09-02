/*
 * Naonsoft Inc., Software License, Version 1.0
 *
 * Copyright (c) 2012 Naonsoft Inc.,
 * All rights reserved.
 *
 * DON'T COPY OR REDISTRIBUTE THIS SOURCE CODE WITHOUT PERMISSION.
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <<Naonsoft Inc.>> OR ITS
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 * USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 *
 * For more information on this product, please see
 * <<www.naonsoft.com>>
 */
package com.naon.biz.gw.doc.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.naon.biz.common.i18n.bean.CmmI18NBean;
import com.naon.biz.common.i18n.service.CmmI18NService;
import com.naon.biz.gw.doc.bean.ArticleBean;
import com.naon.biz.gw.doc.bean.CateMoveBean;
import com.naon.biz.gw.doc.bean.DocCateBean;
import com.naon.biz.gw.doc.bean.FolderBoardNodeBean;
import com.naon.biz.gw.doc.dao.DocCateDAO;
import com.naon.biz.gw.doc.vo.BoardVO;
import com.naon.biz.gw.doc.vo.DocArticleVO;
import com.naon.biz.gw.doc.vo.DocBoardVO;
import com.naon.common.board.exception.BoardNotEmptyException;
import com.naon.common.board.util.BoardUtil;
import com.naon.framework.base.BaseService;
import com.naon.framework.util.MultilingualUtil;
import com.naon.framework.util.StringUtil;

/**
 * Cate 관련 처리하는 서비스 Class입니다.
 * 
 * @author 안요한(ayh0912@naonsoft.com)
 */
@Service
public class DocCateService extends BaseService {

	/** The ms accessor. */
	@Autowired
	private MessageSourceAccessor msAccessor;

	/** 문서함분류 DAO. */
	@Autowired
	private DocCateDAO cateDAO;
	
	@Autowired
	BoardHelper boardHelper;
	
	@Autowired
	CmmI18NService cmmI18NService;
	
	/**
	 * 분류 트리 목록을 가져온다.
	 *
	 * @param boardReq BoardCommonBean
	 * @return ArrayList<DocCateBean>
	 */
	public ArrayList<DocCateBean> getDocMenuTreeJSON(DocBoardVO brdReq) {
		DocCateBean docCateBean = new DocCateBean();
		docCateBean.setCateLoc("/" + DocCateBean.ID_PREFIX + brdReq.getGrpId());
		docCateBean.setLang(brdReq.getLang());
		
		ArrayList<DocCateBean> cateList = (ArrayList<DocCateBean>) cateDAO.getSubAllCateList(docCateBean);
		cateList = makeist(cateList, brdReq.getLang(), brdReq, true);
		
		return cateList;
	}
	
	/**
	 * 주어진 리스트에 분류리스트를 추가하여 메뉴를 만든다.
	 *
	 * @param brdReq DocBoardVO
	 * @param menuList ArrayList
	 * @return ArrayList<DocCateBean>
	 */
//	public ArrayList<DocCateBean> getDocMenuTreeJSON(DocBoardVO brdReq, ArrayList<DocCateBean> menuList) {
//		ArrayList<DocCateBean> cateList = (ArrayList<DocCateBean>) cateDAO.getSubAllCateList("/" + DocCateBean.ID_PREFIX + brdReq.getGrpId() + "%");
//		menuList.addAll(cateList);
//		menuList = makeist(menuList, brdReq.getLang(), brdReq);
//		return menuList;
//	}
	
	private ArrayList<DocCateBean> makeist(ArrayList<DocCateBean> nodeList, String lang, DocBoardVO boardReq, boolean rootYn){
		if(nodeList==null || nodeList.size()==0) return null;
		
		HashMap<String, DocCateBean> map = new HashMap<String, DocCateBean>();
		ArrayList<DocCateBean> returnList = new ArrayList<DocCateBean>();
		
		for(int i=0; i<nodeList.size(); i++){
			DocCateBean treeBean = (DocCateBean) nodeList.get(i);
			DocCateBean node = new DocCateBean();
			node.setKey(treeBean.getKey());
			node.setTitle(MultilingualUtil.getMultilingual(treeBean.getTitle(), lang));
			node.setCateLoc(treeBean.getCateLoc());
			node.setUpCateId(treeBean.getUpCateId());
			node.setCateOrder(treeBean.getCateOrder());
			node.setNodeType("B");
			
			//포스트, to-do list 관련
			node.setShareYn(StringUtils.defaultIfEmpty(treeBean.getShareYn(),"N"));
			node.setUseYn(StringUtils.defaultIfEmpty(treeBean.getUseYn(),"N"));

			map.put(treeBean.getKey(), node);
			if(i==0 || treeBean.getParentNodeId()==null){
				returnList.add(node);
				continue;
			}else if(treeBean.getParentNodeId().equals(DocCateBean.ID_PREFIX + boardReq.getCmpId()) && rootYn){
				returnList.add(node);
				continue;
			}else if(treeBean.getParentNodeId().equals(DocCateBean.ID_PREFIX + boardReq.getGrpId()) && rootYn){
				returnList.add(node);
				continue;
			}
			DocCateBean parentNode = map.get(treeBean.getParentNodeId());
			if(parentNode==null) continue;
			parentNode.setChildrenBean(node);
			parentNode.setIsFolder(true);
		}
		
		return returnList;
		
	}
	
	/**
	 * 분류 목록을 검색하여 가져온다.
	 * 
	 * @param BoardRequestVO
	 * @return List
	 */
	public ArrayList<FolderBoardNodeBean> getSearchCateList(BoardVO boardReq){
		ArrayList<FolderBoardNodeBean> searchList = (ArrayList<FolderBoardNodeBean>) cateDAO.getSearchCateList(boardReq);
		for(FolderBoardNodeBean bean: searchList){
			bean.setTitle(MultilingualUtil.getMultilingual(bean.getTitle(),boardReq.getLang()));
		}
		
		return searchList;
	}
	
	/**
	 * 게시물의 분류경로명를 조회한다.
	 *
	 * @param atclNo String
	 * @return the cate atcl rel name list
	 */
	public ArrayList<String> getCateAtclRelNameList(DocArticleVO atclReq){
		return (ArrayList<String>) cateDAO.getCateAtclRelNameList(atclReq);
	}
	
	/**
	 * 게시물의 분류경로의 각각의 id와 분류명를 조회한다.
	 *
	 * @param atclNo String
	 * @return the cate atcl rel list
	 */
	public List<HashMap<String, String>> getCateAtclRelList(DocArticleVO atclReq){
		return (List<HashMap<String, String>>) cateDAO.getCateAtclRelList(atclReq);
	}
	
	/**
	 * 게시물이력의 분류경로의 각각의 id와 분류명를 조회한다.
	 *
	 * @param atclReq ArticleRequest
	 * @return the cate atcl rel his list
	 */
	public List<HashMap<String, String>> getCateAtclRelHisList(DocArticleVO atclReq){
		return (List<HashMap<String, String>>) cateDAO.getCateAtclRelHisList(atclReq);
	}
	
	/**
	 * 문서의 분서분류명을 구분자로 연결하여 반환한다.
	 *
	 * @param atclReq ArticleRequest
	 * @param conStr String
	 * @return the cate atcl rel name his list
	 */
	public ArrayList<String> getCateAtclRelNameHisList(DocArticleVO atclReq) {
		return (ArrayList<String>) cateDAO.getCateAtclRelNameHisList(atclReq);
	}
	
	/**
	 * 문서의 문서분류관계의 분류고유아이디를 콤마구분자로 가져온다.
	 *
	 * @param atclNo String
	 * @return the cate atcl rel str
	 */
	public String getCateAtclRelStr(String atclNo){
		List<String> list = cateDAO.getCateAtclRelStrList(atclNo);
		return StringUtil.join(list, ",", false);
	}
	
	/**
	 * Selectbox에서 사용할 해당문서에 관련된 모든 분류를 가져온다.
	 *
	 * @param atclReq DocArticleVO
	 * @return the cate list in atcl
	 */
	public ArrayList<DocCateBean> getCateListInAtcl(DocArticleVO atclReq){
		return (ArrayList<DocCateBean>) cateDAO.getCateListInAtcl(atclReq);
	}
	
	/**
	 * 하위분류코드를 조회한다.
	 *
	 * @param cateId String
	 * @return the sub cate list
	 */
	public ArrayList<DocCateBean> getSubCateList(DocCateBean docCateBean) {
		return (ArrayList<DocCateBean>) cateDAO.getSubCateList(docCateBean);
	}
	
	/**
	 * 분류게시물관계 수정.
	 *
	 * @param article ArticleBean
	 * @return the int
	 */
	public int updateCateAtclRels(ArticleBean article){
		boardHelper.insertAtclChgCateHistory(article);
		return cateDAO.updateCateAtclRels(article);
	}
	
	/**
	 * 분류게시물관계이력을 조회한다.
	 *
	 * @param atclReq DocArticleVO
	 * @return the cate atcl rel his str
	 */
	public String getCateAtclRelHisStr(DocArticleVO atclReq) {
		ArrayList<String> list = (ArrayList<String>) cateDAO.getCateAtclRelHisStrList(atclReq);
		return BoardUtil.getListToString(list);
	}
	
	/**
	 * 해당 게시물이력에서 분류게시물관계를 조회한다.
	 *
	 * @param atclReq DocArticleVO
	 * @return the cate list in atcl his
	 */
	public ArrayList<DocCateBean> getCateListInAtclHis(DocArticleVO atclReq) {
		return (ArrayList<DocCateBean>) cateDAO.getCateListInAtclHis(atclReq);
	}
	
	/**
	 * 분류리스트를 메뉴로 만든다.
	 *
	 * @param brdReq DocBoardVO
	 * @return the cate tree json
	 */
	public ArrayList<DocCateBean> getCateTreeJSON(DocBoardVO brdReq) {
		DocCateBean docCateBean = new DocCateBean();
		docCateBean.setCateId(DocCateBean.ID_PREFIX + brdReq.getGrpId());
		docCateBean.setLang(brdReq.getLang());
		
		return makeist((ArrayList<DocCateBean>) cateDAO.getCateList(docCateBean), brdReq.getLang(), brdReq, false);
	}
	
	/**
	 * 문서분류를 추가한다.
	 *
	 * @param cateBean DocCateBean
	 */
	@Transactional(value = "transactionManager")
	public void insertCate(DocCateBean cateBean) {
		if(StringUtils.isEmpty(cateBean.getCateId())){
			cateBean.generateNewCateId();
		}
		
		//다국어 저장
 		List<CmmI18NBean> cateNames = cateBean.getCateNames();
 		for (CmmI18NBean cmmI18NBean : cateNames) {
			if(StringUtil.isNotEmpty(cmmI18NBean.getItemName())) {
				cmmI18NBean.setTrgtId(cateBean.getCateId());
				cmmI18NBean.setTrgtColName(DocCateBean.I18N_COL_NAME);
				cmmI18NService.insertCmmi18n(cmmI18NBean);
			}
		}
		
		cateDAO.insertCate(cateBean);
	}
	
	/**
	 * 문서분류를 수정한다.
	 *
	 * @param cateBean DocCateBean
	 */
	@Transactional(value = "transactionManager")
	public void updateCate(DocCateBean cateBean) {
		//다국어 저장
		for (CmmI18NBean cmmI18NBean : cateBean.getCateNames()) {
			cmmI18NBean.setTrgtId(cateBean.getCateId());
			cmmI18NBean.setTrgtColName(DocCateBean.I18N_COL_NAME);
			
			if (cmmI18NService.selectExisti18n(cmmI18NBean) == 0) {
				if(StringUtil.isNotEmpty(cmmI18NBean.getItemName())) {
					cmmI18NService.insertCmmi18n(cmmI18NBean);
				}
			} else {
				if(StringUtil.isNotEmpty(cmmI18NBean.getItemName())) {
					cmmI18NService.updateCmmi18n(cmmI18NBean);
				} else {
					cmmI18NService.deleteCmmi18n(cmmI18NBean);
				}
			}
		}
		
		cateDAO.updateCate(cateBean);
	}
	
	/**
	 * 문서분류를 삭제한다.
	 *
	 * @param cateBean DocCateBean
	 * @throws BoardNotEmptyException board not empty exception
	 */
	@Transactional(value = "transactionManager")
	public void deleteCate(DocCateBean cateBean) throws BoardNotEmptyException {
		DocCateBean delCateBean = cateDAO.getCate(cateBean);
		if( cateDAO.haveDocInChildCate(delCateBean))
			throw new BoardNotEmptyException("doc.alert.deletefail.notemptydoccategory");
		
		cateDAO.deleteCateExtensionFromCate(delCateBean);
		cateDAO.deleteCateAtclRelAndChild(delCateBean);
		cateDAO.deleteCateAtclRelHisAndChild(delCateBean);

		if( cateDAO.isRealDocEmptyInChildCate(delCateBean)){
			cateDAO.updateToDisableCateAndChild(delCateBean);
		}else{
			cateDAO.deleteCateAndChild(delCateBean);
		}
		
		//다국어 제거
 		CmmI18NBean cmmi18nBean = new CmmI18NBean();
 		cmmi18nBean.setTrgtId(delCateBean.getCateId());
 		cmmi18nBean.setTrgtColName(DocCateBean.I18N_COL_NAME);
 		cmmI18NService.deleteCmmi18n(cmmi18nBean);
	}
	
	
	/**
	 * 분류를 가져온다.
	 * @param cateId
	 * @return
	 */
	public DocCateBean getCate(DocCateBean docCateBean) {
		docCateBean = cateDAO.getCate(docCateBean);
		if(docCateBean != null) {
			CmmI18NBean i18nBean = new CmmI18NBean();
			i18nBean.setTrgtId(docCateBean.getCateId());
			i18nBean.setTrgtColName(DocCateBean.I18N_COL_NAME);
			docCateBean.setCateNames(cmmI18NService.selectCmmi18nListByTrgtId(i18nBean));
		}
		return docCateBean;
	}
	
	/**
	 * 드레그엔드롭 분류트리
	 * - 드레그엔드롭이 가능한 분류 트리를 ex-tree json 형태로 리턴.
	 *
	 * @param grpId String
	 * @param lang String
	 * @return the dragable all board tree json
	 */
	public ArrayList<DocCateBean> getDragableAllCateTreeJSON(DocBoardVO boardReq) {
		DocCateBean docCateBean = new DocCateBean();
		docCateBean.setCateId(DocCateBean.ID_PREFIX + boardReq.getGrpId());
		docCateBean.setLang(boardReq.getLang());
		
		return makeist((ArrayList<DocCateBean>) cateDAO.getCateList(docCateBean), boardReq.getLang(), boardReq, false);
	}
	/**
	 * 분류를 이동한다.
	 *
	 * @param cateMoveBean CateMoveBean
	 */
	public void updateCateMove(CateMoveBean cateMoveBean) {
		CateMoveBean moveInfoBean = cateDAO.getCateMove(cateMoveBean);
	
		cateDAO.updateTargetBelowCateOrder(moveInfoBean);
		cateDAO.updateCateMove(moveInfoBean);
		cateDAO.updateChildCateMove(moveInfoBean);
		cateDAO.updateCurrentBelowCateOrder(moveInfoBean);
	}
	/**
	 * 분류 순서를 이동한다.
	 *
	 * @param cateMoveBean CateMoveBean
	 */
	public void updateCateOrder(String[] cateIds) {
		if (cateIds != null) {
			CateMoveBean cate = new CateMoveBean();
			for (int i = 0; i < cateIds.length; i++) {
				cate.setCateId(cateIds[i]);
				cate.setCateOrder(i+1);
				cateDAO.updateCateOrder(cate);
			}
		}
	}
}
